const Category = require("../models/category")

exports.getCategoryById=(req,res,next,id)=>{

    Category.findById(id)
    .populate("category")
    .exec((err,cate)=>{
        if(err){
            return res.status(400).json({
                error: "Category not found in DB"
            })
        }
        req.category= cate;
        console.log(cate+ "cat");
        next();
    })  
};

exports.createCategory=(req,res)=>{
    const category= new Category(req.body);
    category.save((err,category)=>{
        if(err){
            return res.status(400).json({
                error: "Not able to save category"
            });
        }
        res.json({category});
    })
}

exports.getCategory=(req,res)=>{
    //
    return res.json(req.category);
}
exports.getCategories=(req,res)=>{
    //
    category.find().exec((err,categories)=>{
        if(err){
            return res.status(400).json({
                error: "No categories found"
            });
        }
        res.json(categories);
    })

}

exports.updateCategory=(req,res)=>{
    const category=  req.category;
    console.log(req.category+ "category");
    category.name=req.body.name;
    console.log(category.name+ "category name");
    category.save((err,updatedCategory)=>{
        if(err){
            return res.status(400).json({
                error: "fail to update category"
            });
        }
        res.json(updatedCategory);
    })
}

exports.removeCategory=(req,res)=>{
    const category=req.category;
    category.remove((err,category)=>{
        if(err){
            return res.status(400).json({
                error: "fail to delete this category"
            });
        }
        res.json({
            message: "Sucessfully deleted"
        })
    })
}