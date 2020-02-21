var express = require('express');
var route = express.Router();
const {generateToken,decryptToken}=require('../service/tokenservice');
const {generateUUID}=require('../service/uuidservice');
const passport = require('../authenticate/passport_init')
const key=require('../service/key');
const {validateUsername,validatePassword,validateEmail} =require('../companymiddleware');
const { company_basic_details }  = require('../db/index');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


route.post('/register', validateUsername,validatePassword,validateEmail,async (req, res) => {
    const companyid= await generateUUID();
    const companytoken= await generateToken(req.body.company.email);
    console.log(req.body.company.email)
  
    try {
      const registerCompany = await company_basic_details.create({
        emailId: req.body.company.email,
        password: req.body.company.password,
        company_basic_detail_id: companyid,
        company_name:req.body.company.company_name,
        location:req.body.company.location
      })
      console.log(req.body.company.name)
  
      
  
      res.status(201).json({
        company: {
          email: registerCompany.email,
          company_name: registerCompany.company_name,
          image: null,
         token:companytoken
        }
      })
    } catch(err) {
      res.status(500).json({
        errors:{
            body: err
        }
      })
    }
  
  })

  route.post(
    "/login",
    validateEmail,validatePassword,
    async(req,res)=>{
  
      
      const companytoken = await generateToken(req.body.company.email);
      try{
          const company= await company_basic_details.findOne({
              where:{
                  emailId:req.body.company.email,
                  
              }
          })
         // console.log(company)
         if(company)
         {
          bcrypt.compare(req.body.company.password,company.password,function(err,isMatch){
              console.log(bcrypt.hashSync(req.body.company.password, 10))
              console.log(company.password)
              if(err)
              {
                  res.status(500).json({
                      errors: {
                        body: err
                      }
                    });
              }
              else if(!isMatch){
                  res.status(403).json({
                      errors: {
                        body: "Unauthenticated User"
                      }
                    });
              }
              else{
                  console.log("succesfully logged in");
                 res.status(201).json({
                  user: {
                    emailId: company.email,
                    name: company.name,
                    image: null,
                    token: companytoken
                  }
              })
              }
          
      })
      }
      else{
          res.status(401).json({
              errors: {
                body: "Unauthorised User"
              }
            });
      }
  }
  
      catch(err)
      {
        res.status(500).json({
          errors: {
            body: err
          }
        });
      }
  }
    
  );


module.exports = route;





