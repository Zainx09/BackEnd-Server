const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({

    username: {
        type: String,  
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,  
        required: true
    }
});


//this function will run before we save the user into db
//use for encryption password
userSchema.pre('save' , function(next){

    //we cant get 'this' in arrow function. 
    //here 'this' means that we get the user
    const user = this;


    //if user not modify its password then dont do salting and return to next function
    //means if user not login for the first time
    if (!user.isModified('password')){
        return next();
    }


    //if user login for the first time then we need to generate salt and hash password
    //salting 10 times
    bcrypt.genSalt(10 , (err, salt)=>{
        if(err){
            return next(err);
        }

        //if we successfully generate salt then hash the password and add salt in it
        bcrypt.hash(user.password, salt , (err, hash)=>{

            if(err){
                return next(err);
            }

            //now replace the plain text password into hash
            user.password = hash;

            //now continue to save our user
            next();
        })
    });
});


//this function compare the passwords in hash 
//here canditatePassword is the password that the user is trying to login with 
userSchema.methods.comparePassword = function(candidatePassword){

    const user = this;
    
    return new Promise((resolve, reject)=>{

        bcrypt.compare(candidatePassword, user.password, (err, isMatch)=>{

            if(err){
                return reject(err);
            }

            //if password not matched
            if(!isMatch){
                return reject(false);
            }

            //finally password matched
            resolve(true);
        });
    });
}


//we dont export model because we only need to run this code only single time.
mongoose.model("User" , userSchema);