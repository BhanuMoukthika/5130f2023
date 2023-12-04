const mysql = require("mysql");
const jwt =require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const { promisify } = require('util');
const cookieParser= require("cookie-parser");
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
const db= mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE
});
exports.signup =(req,res)=>{
    console.log("formdata:",req.body);
    const { signupFirstName, signupLastName, signupSex, signupDOB, signupAddress, signupEmail, signupPassword,confirmPassword } = req.body;
    console.log(signupFirstName, signupLastName, signupSex, signupDOB, signupAddress, signupEmail, signupPassword,confirmPassword);

    db.query('SELECT email FROM users WHERE email=?', [signupEmail], async(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length>0){
            return res.render("signup",{
                message:"Email is already registered"
            });

        }else if(!passwordRegex.test(signupPassword)){
            return res.render("signup",{
                message:"Please use strong password"
            });
        }
        else if(signupPassword!==confirmPassword){
            return res.render("signup",{
                message:"Passwords do not match"
            });
        }
        let hashedPassword = await bcrypt.hash(signupPassword,8);
        console.log(hashedPassword);
        db.query("Insert INTO users SET ?",{
            first_name:signupFirstName,
            last_name:signupLastName,
            sex:signupSex,
            date_of_birth:signupDOB,
            address:signupAddress,
            email:signupEmail,
            password:hashedPassword},
            (error,results)=>{
                if(error){
                    console.log(error);
                }
                else{
                    console.log(results);
                    return res.render("login",{
                        message:"User Registered Successfully"
                    });
                }
            }
        );
        
    });
    
}
exports.login = async(req,res)=>{
    const {loginUsername,loginPassword} = req.body;
    console.log(loginUsername,loginPassword);
    if(!(loginUsername || loginPassword)){
        return res.render("login",{
            message:"Please provide an Email and Password"
        });
    }
    else{
        db.query('SELECT * FROM users WHERE email=?', [loginUsername], async(error,results)=>{
            if(error){
                console.log(error);
            }

            if(results.length==0){
                return res.render("login",{
                    message:"Email is not registered"
                });
            }
            bcrypt.compare(loginPassword, results[0].password, (err, result) => {
                if (err) {
                console.error(err);
                }
            
                if (result) {

                    const id=results[0].user_id;
                    const token=jwt.sign({id:id},process.env.JWT_SECRET,{
                        expiresIn: process.env.JWT_EXPIRES_IN
                    });
                    console.log("token:",token);
                    const cookieOptions={
                        expires: new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES*24*60*60*1000
                        ),
                        httpOnly:true
                    }
                    res.cookie('jwt',token,cookieOptions);
                    res.status(200).redirect("/dashboard")
                } else {
                    return res.render("login",{
                        message:"Password is Incorrect"
                    });
                }
            });
        });
    }

}
exports.isLoggedIn= async(req,res,next)=>{
    console.log(req.cookies);
    
    if(req.cookies.jwt){
        try{
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET
              );
            console.log(decoded);
            db.query('SELECT * FROM users WHERE user_id=?', [decoded.id], async(error,result)=>{
                if(!result){
                    return next();
                }
                req.user=result[0];
                return next();
            });
        }
        catch(error){
            console.log(error);
            return next();
        }
    }
    else{
        next();
    }
    
}
exports.logout= async(req,res)=>{
    res.cookie('jwt','logout',{
        expires: new Date(Date.now()+ 2*1000),
        httpOnly:true
    });
    res.status(200).redirect('/');
};
exports.calculateBMR = (req, res) => {
    const { user_id, weight, heightFeet, heightInches, age, gender, program } = req.body;
    // Convert height to inches
    const weight_ = parseInt(weight);
    const heightFeet_ = parseInt(heightFeet);
    const heightInches_ = parseInt(heightInches);
    const age_ = parseInt(age);
    const heightInInches = heightFeet_ * 12 + heightInches_;
    
    // Calculate BMI
    var bmi = (weight_ / (heightInInches ** 2)) * 703;
    
    // Calculate BMR using Harris-Benedict equation
    var bmr;
    if (gender === 'male') {
        bmr = 66 + 6.23 * weight_ + 12.7 * heightInInches - 6.8 * age_;
    } else {
        bmr = 655 + 4.35 * weight_ + 4.7 * heightInInches - 4.7 * age_;
    }
    
    // Calculate maintenance calories based on the program
    var maintenanceCalories;
    if (program === 'weightLoss') {
        maintenanceCalories = bmr - 500; // Reduce 500 calories for weight loss
    } else {
        maintenanceCalories = bmr + 500; // Add 500 calories for weight gain
    }
    bmi=bmi.toFixed(2);
    bmr=bmr.toFixed(2);
    maintenanceCalories=maintenanceCalories.toFixed(2);
    console.log("BMI:", bmi);
    console.log("BMR:", bmr);
    console.log("Maintenance Calories:", maintenanceCalories);
    
    db.query('UPDATE users SET bmi = ?, bmr = ?, maintenance_calories = ? WHERE user_id = ?',[bmi,bmr,maintenanceCalories,user_id], async(error,result)=>{
        if(error){
            console.log("here:",error);
        }
    });
    db.query('SELECT * FROM users WHERE user_id=?',[user_id],async(error,result)=>{
        if(error){
            console.log(error);
        }
        console.log(result[0]);
        res.json({ 
            bmi: result[0].bmi,
            bmr:result[0].bmr,
            maintenanceCalories:result[0].maintenance_calories
     });
    });
  };
