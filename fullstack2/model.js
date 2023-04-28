const { Schema , model , Types } = require("mongoose")

const oeuvreSchema = new Schema({
    nom : String ,
    description : String , 
    //image : uri ,
    dt_creation : Number, 
    auteur : { 
    type : Types.ObjectId ,  ref : "users" 
    }     
});

const Oeuvre = model("oeuvres" , oeuvreSchema) ;

const userSchema = new Schema({
    email : String ,
    password : String ,
    role : { type : String , enum : ['redacteur' , 'admin'] } 
})

const User = model("users" , userSchema);


module.exports.Oeuvre = Oeuvre ;
module.exports.User = User ;
