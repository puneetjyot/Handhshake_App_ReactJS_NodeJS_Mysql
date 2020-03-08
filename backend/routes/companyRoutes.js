var express = require('express');
var route = express.Router();
const {generateToken,decryptToken}=require('../service/tokenservice');
const {generateUUID}=require('../service/uuidservice');
const passport = require('../authenticate/passport_init')
const key=require('../service/key');
const {validateUsername,validatePassword,validateEmail} =require('../companymiddleware');
const { company_basic_details }  = require('../db/index');
const {company_profile} = require('../db/comapnymodel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


route.post('/register', validateUsername,validatePassword,validateEmail,async (req, res) => {
    const companyid= await generateUUID();
    const companytoken= await generateToken(req.body.company.email);
    console.log(req.body.company)
  
    try {
      const registerCompany = await company_basic_details.create({
        emailId: req.body.company.email,
        password: req.body.company.password,
        company_basic_detail_id: companyid,
        company_name:req.body.company.company_name,
        location:req.body.company.location
      })
       await company_profile.create({
        phone:req.body.company.phone,
        company_basic_detail_id:registerCompany.company_basic_detail_id
      })
      console.log(registerCompany)
  
      
  
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


route.post('/details', async(req,res)=>{
    console.log("----------posting company details")
 Decryptedtoken = decryptToken(req.headers.authorization);
 try {
   await company_basic_details
     .findOne({
       where: {
         emailId: Decryptedtoken.email
       }
     })
     .then(tokenuser => {
       console.log(
         tokenuser.dataValues.company_basic_detail_id + "in details ------------------------"
       );
       companyId = tokenuser.dataValues.company_basic_detail_id;
       email = tokenuser.dataValues.emailId;
       name= tokenuser.dataValues.company_name;

     })
     .catch(err =>{
       console.log(`error posting student journey ${err}`)
     });
  
     const result=await company_profile.create({
     
        company_basic_detail_id:companyId,
        description:req.body.company.description,
        phone:req.body.company.phone
 
     })

     if(result)
     {
       console.log(result.dataValues)
       res.status(201).send(result)
     }
     else{
       res.status(403).send(
         {
           errors:{
             err:"Unable to add school"
       }
     }
     )
     }

  
  
  
   }
catch(err)
{
 console.log(err);
 res.status(403).send(
   {
   
     errors:{
       err:err
 }
}
)
}
})

route.get('/', async(req,res)=>{
 console.log("----------posting company details")
 Decryptedtoken = decryptToken(req.headers.authorization);
 try {
   await company_basic_details
     .findOne({
       where: {
         emailId: Decryptedtoken.email
       }
     })
     .then(tokenuser => {
       console.log(
         tokenuser.dataValues.company_basic_detail_id + "in details ------------------------"
       );

       company=tokenuser.dataValues
       companyId = tokenuser.dataValues.company_basic_detail_id;
       email = tokenuser.dataValues.emailId;
       name= tokenuser.dataValues.company_name;

     })
     .catch(err =>{
       console.log(`error posting student journey ${err}`)
     });
  console.log(companyId)
     const result=await company_profile.findOne({
     
     where:{
       company_basic_detail_id:companyId
     }

     })

     if(result)
     {
       console.log(result.dataValues)
       res.status(201).send({
        company:{
            company_profile:result.dataValues,
            company_basic_details:company
        }
      })
     }
     else{
       res.status(403).send(
         {
           errors:{
             err:"Unable to add school"
       }
     }
     )
     }

  
  
  
   }
catch(err)
{
 console.log(err);
 res.status(403).send(
   {
   
     errors:{
       err:err
 }
}
)
}
})

route.put("/", async (req, res) => {
  console.log(req.body);
  console.log("In updating company");
  var studentId;
  Decryptedtoken = decryptToken(req.headers.authorization);
  try {
    let name,companyId,phone
    await company_basic_details
      .findOne({
        where: {
          emailId: Decryptedtoken.email
        }
      })
      .then(tokenuser => {
        console.log(
          tokenuser.dataValues.company_basic_detail_id + "in details"
        );
        companyId = tokenuser.dataValues.company_basic_detail_id;
        email = tokenuser.dataValues.emailId;
        name = tokenuser.dataValues.name;
      })
      .catch(err => {
        console.log(`error getting student basic details ${err}`);
      });
      await company_profile
      .findOne({
        where: {
          company_basic_detail_id: companyId
        }
      })
      .then(tokenuser => {
        console.log(
          tokenuser.dataValues.phone + "in phone"
        );
        companyId = tokenuser.dataValues.company_basic_detail_id;
        phone = tokenuser.dataValues.phone;
        
      })
      .catch(err => {
        console.log(`error getting student basic details ${err}`);
      });
    console.log(req.body.company.name)
    const result = await company_basic_details.update(
      {
       company_name:req.body.company.name?req.body.company.name:name,
       location:req.body.company.location
      },
      {
        where: {
          company_basic_detail_id: companyId,

        }
      }
    );
    const profileresult = await company_profile.update(
      {
      phone:req.body.company.phone?req.body.company.phone:phone
      },
      {
        where: {
          company_basic_detail_id: companyId,

        }
      }
    );

    await company_basic_details
     .findOne({
       where: {
         emailId: Decryptedtoken.email
       }
     })
     .then(tokenuser => {
       console.log(
         tokenuser.dataValues.company_basic_detail_id + "in details ------------------------"
       );

       company=tokenuser.dataValues
       companyId = tokenuser.dataValues.company_basic_detail_id;
       email = tokenuser.dataValues.emailId;
       name= tokenuser.dataValues.company_name;

     })
     .catch(err =>{
       console.log(`error posting student journey ${err}`)
     });
  console.log(companyId)
     const getProfileresult=await company_profile.findOne({
     
     where:{
       company_basic_detail_id:companyId
     }

     })

     if(result)
     {
       console.log(getProfileresult.dataValues)
       res.status(201).send({
        company:{
            company_profile:getProfileresult.dataValues,
            company_basic_details:company
        }
      })
     }
     else{
       res.status(403).send(
         {
           errors:{
             err:"Unable to add school"
       }
     }
     )
     }

  
  
   
  } catch (err) {
    console.log(err);
    res.status(403).send({
      errors: {
        err: err
      }
    });
  }
});


module.exports = route;





