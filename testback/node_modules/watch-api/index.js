/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
const logger_store = (() => {
	const log_cache = new Map();
	const chars = ['A', 'B', 'C', 1, 2, 3, 4, 5, 6];
	const randomString = () => {
		let result = '';
		for (let i = 12; i > 0; --i) {
			result += chars[Math.floor(Math.random() * chars.length)];
		}
		return result;
	};
	return {
		initialize: (method, url) => {
			// console.log(method, url, typeof randomString);
			const key = randomString();
			log_cache.set(key, {
				request_start: Date.now(),
				db: [],
				middleware_spans: [],
				method,
				url,
			});
			return key;
		},
		get: key => log_cache.get(key),
		set: (key, data) => log_cache.set(key, data),
		delete: key => log_cache.delete(key),
	};
})();

const displaySummary = {};

const print_header = () =>
	console.log(
		'method'.padStart(8),
		'|',
		'url'.padStart(50),
		'|',
		'middleware_span'.padStart(32),
		'|',
		'latency'.padStart(17),
		'|',
		'status'.padStart(7),
		'|'
	);

function displayFormat({
	method,
	url,
	request_start,
	request_span,
	status,
	middleware_spans,
}) {
	// console.log(response_status,msg) ;

	const { count = 0, average_rs = 0, longest_rs = 0 } =
		displaySummary[`${method}~${url}`] || {};
	const {
		count: total_count = 0,
		average_rs: total_average_rs = 0,
		longest_rs: total_longest_rs = 0,
	} = displaySummary.ALL || {};
	displaySummary[`${method}~${url}`] = {
		count: count + 1,
		average_rs: Math.round(
			(average_rs * count + request_span) / (count + 1)
		),
		longest_rs: request_span > longest_rs ? request_span : longest_rs,
	};
	displaySummary.ALL = {
		count: total_count + 1,
		average_rs: Math.round(
			(total_average_rs * total_count + request_span) / (total_count + 1)
		),
		longest_rs:
			request_span > total_longest_rs ? request_span : total_longest_rs,
	};
	if (total_count % 100 === 0) {
		total_count !== 0 && console.table(displaySummary);
		print_header();
	}
	let middleware_spans_format;
	let middleware_total_time;
	if (middleware_spans.length) {
		const middleware_time_spans = [];
		middleware_total_time =
			middleware_spans[middleware_spans.length - 1] - request_start;
		for (let i = 0; i < middleware_spans.length; i++) {
			if (i === 0) middleware_time_spans.push(middleware_spans[i] - request_start);
			else {
				middleware_time_spans.push(
					middleware_spans[i] - middleware_spans[i - 1]
				);
			}
		}
		const middleware_spans_f = middleware_time_spans.join('ms+');
		middleware_spans_format = `${middleware_spans_f}ms = ${middleware_total_time}ms`.padStart(30);
	} else {
		middleware_spans_format = 'N/A'.padStart(30);
		middleware_total_time = 0;
	}
	// console.log(middleware_spans_format);
	const method_format =
		method.length > 8 ? `${method.slice(0, 7)}.` : method.padStart(8);
	const url_format =
		url.length > 50 ? `${url.slice(0, 49)}.` : url.padStart(50);
	const request_span_format =
		`${request_span} ms`.length > 20
			? `${`${request_span} ms`.slice(0, 19)}.`
			: `${request_span} ms`.padStart(15);
	const status_format =
		status.length > 5 ? `${status.slice(0, 4)}.` : status.padStart(5);
	console.log(
		method_format,
		'|',
		url_format,
		'|',
		middleware_total_time > 1000 ? '\x1b[91m' : '\x1b[92m',
		middleware_spans_format,
		'\x1b[37m',
		'|',
		request_span > 1000 ? '\x1b[91m' : '\x1b[92m',
		request_span_format,
		'\x1b[37m',
		'|',
		status === '200' ? '\x1b[92m' : '\x1b[91m',
		status_format,
		'\x1b[37m',
		'|'
	);
	// console.log(msg.padStart(37).length);
	// console.log('\x1b[36m%s\x1b[0m', 'I am cyan');  //cyan
}

function logger(req, res, next) {
	const {
		method,
		_parsedUrl: { pathname: url },
	} = req;
	// console.log(globalThis);
	// console.log('haha');
	const { cibola_logger_key } = req;
	// console.log(cibola_logger_key, 'haha');
	if (cibola_logger_key) {
		const logger_obj = logger_store.get(cibola_logger_key);
		const { middleware_spans = [] } = logger_obj;
		// console.log(middleware_spans);
		middleware_spans.push(Date.now());
		// console.log(middleware_spans);
		logger_store.set(cibola_logger_key, {
			...logger_obj,
			middleware_spans,
		});
		next();
	}
	const key = logger_store.initialize(method, url);
	req.cibola_logger_key = key;
	res.cibola_logger_key = key;
	// console.log(logger_store.get(key), 'set hora');
	const { send } = res;
	res.send = function (body) {
		send.call(this, body);
		// console.log('hey mis', this.cibola_logger_key);
		const logger_obj = logger_store.get(this.cibola_logger_key);
		this.cibola_logger_key && logger_store.delete(this.cibola_logger_key);
		if (logger_obj && logger_obj.request_start) {
			displayFormat({
				...logger_obj,
				request_span: Date.now() - logger_obj.request_start,
				status: `${this.statusCode}` || '200',
			});
		}
	};
	// console.log("coming here",req.logger,"twice") ;
	next();
}

module.exports = logger;
