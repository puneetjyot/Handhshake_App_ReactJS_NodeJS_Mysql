var express = require("express");
var route = express.Router();
const { generateToken, decryptToken } = require("../service/tokenservice");
const { generateUUID } = require("../service/uuidservice");
const passport = require("../authenticate/passport_init");
const key = require("../service/key");
const {
  validateUsername,
  validatePassword,
  validateEmail
} = require("../studentmiddleware");
const { student_basic_details } = require("../db/index");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

route.post(
  "/register",
  validateUsername,
  validatePassword,
  validateEmail,
  async (req, res) => {
    const studentid = await generateUUID();
    const studenttoken = await generateToken(req.body.student.email);
    console.log(req.body.student.email);

    try {
      const registerStudent = await student_basic_details.create({
        emailId: req.body.student.email,
        password: req.body.student.password,
        student_basic_detail_id: studentid,
        name: req.body.student.name,
        college: req.body.student.college
      });
      console.log(req.body.student.name);

      res.status(201).send({
        user: {
          email: registerStudent.email,
          name: registerStudent.name,
          image: null,
          token: studenttoken
        }
      });
    } catch (err) {
      res.status(500).send({
        errors: {
          body: err
        }
      });
    }
  }
);

route.post(
  "/login",
  validateEmail,validatePassword,
  async(req,res)=>{

    console.log(req.body.student.email);
    console.log("In login")
    
    const studenttoken = await generateToken(req.body.student.email);
    try{
        const student= await student_basic_details.findOne({
            where:{
                emailId:req.body.student.email,
                
            }
        })
       // console.log(student)
       if(student)
       {
        bcrypt.compare(req.body.student.password,student.password,function(err,isMatch){
            console.log(bcrypt.hashSync(req.body.student.password, 10))
            console.log(student.password)
            if(err)
            {
                res.status(500).send({
                    errors: {
                      body: err
                    }
                  });
            }
            else if(!isMatch){
                res.status(403).send({
                    errors: {
                      body: "Unauthenticated User"
                    }
                  });
            }
            else{
                console.log("succesfully logged in");
               res.status(201).send({
                user: {
                  emailId: student.email,
                  name: student.name,
                  image: null,
                  token: studenttoken
                }
            })
            }
        
    })
    }
    else{
        res.status(401).send({
            errors: {
              body: "Unauthorised User"
            }
          });
    }
}

    catch(err)
    {
        res.status(500).send({
            errors: {
              body: err
            }
          });
    }
}
  
);

module.exports = route;
