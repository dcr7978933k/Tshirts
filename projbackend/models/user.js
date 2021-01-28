const mongoose=require("mongoose")
//const { Schema } = mongoose;
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

  const userSchema = new mongoose.Schema({
      name: {
          type: String,
          required: true,
          maxlength:32,
          trim: true,
      },
      last_name: {
        type: String,
        maxlength:32,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    userinfo:{
        type: String,
        trim: true,
        //required: true
    },
    //TODO
    encry_password: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    purchases: {
        type: Array,
        default :[]
    },
   
  },
  {
    timestamps: true
  }
  );

  userSchema.virtual("password")
      .set(function(password){
          this._password=password;
          this.salt=uuidv1();
          this.encry_password= this.securedPassword(password)
      })
      .get(
          function(){
              this._password; 
          }
      )
  

  userSchema.methods= {

    authentication:function(plan_password){
        return this.securedPassword(plan_password)===this.encry_password;
    },

      securedPassword: function(plan_password){
          if(!plan_password) return "";
          try{
              return crypto.createHmac('sha256',this.salt )
              .update(plan_password)
              .digest('hex');

          }
          catch(error){
              return "";
          }
      }
  }
  module.exports =mongoose.model("User",userSchema)