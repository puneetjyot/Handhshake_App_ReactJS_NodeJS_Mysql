var express = require("express");
var route = express.Router();
const { generateToken, decryptToken } = require("../service/tokenservice");
const { generateUUID } = require("../service/uuidservice");
const passport = require("../authenticate/passport_init");
const key = require("../service/key");
const fileUpload = require('express-fileupload');
const {
  student_basic_details
  // student_profile,
  // student_education,
  // student_skills
} = require("../db/index");
const {
  student_profile,
  student_education,
  student_skills,
  student_experience
} = require("../db/studentmodel");
const{
    job,studentjobs
} = require('../db/jobmodel')
const{company_basic_details} =require('../db/comapnymodel')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var multer = require('multer')
route.use(fileUpload());


var storage = multer.diskStorage({
      destination: function (req, file, cb) {
      cb(null, 'public')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' +file.originalname )
    }
})

var upload = multer({ storage: storage }).single('file')

route.get('/',async(req,res)=>{
     console.log("----------getting jobs")
  // Decryptedtoken = decryptToken(req.headers.authorization);
   try {
  //   await student_basic_details
  //     .findOne({
  //       where: {
  //         emailId: Decryptedtoken.email
  //       }
  //     })
  //     .then(tokenuser => {
  //       console.log(
  //         tokenuser.dataValues.student_basic_detail_id + "in details ------------------------"
  //       );
  //       studentId = tokenuser.dataValues.student_basic_detail_id;
  //       email = tokenuser.dataValues.emailId;
  //       name= tokenuser.dataValues.name;

  //     })
  //     .catch(err =>{
  //       console.log(`error posting student journey ${err}`)
  //     });
    
      const result = await job.findAll({
        include:[{
              model:company_basic_details
           
          }]
      }
      )
      console.log("sending jobs-----------------"+result)
      res.status(201).send(
        {
          result:result 
        }
      )
}
catch(err)
{
  console.log(`error getting jobs ${err}`)
  res.status(500).send({
    errors: {
      body: err
    }

})
}
})

route.post('/', async(req,res)=>{
     console.log("----------getting jobs")
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
          tokenuser.dataValues.student_basic_detail_id + "in details ------------------------"
        );
        companyId = tokenuser.dataValues.company_basic_detail_id;
        email = tokenuser.dataValues.emailId;
        name= tokenuser.dataValues.company_name;

      })
      .catch(err =>{
        console.log(`error posting student journey ${err}`)
      });
   
      const result=await job.create({
    
        job_title: req.body.job.job_title,
        deadline: req.body.job.deadline,
        location: req.body.job.location,
        salary: req.body.job.salary,
        job_description: req.body.job.job_description,
        job_category: req.body.job.job_category,
        company_basic_detail_id:companyId
       
        
      })

      if(result)
      {
        res.status(201).send({...result.dataValues,company_basic_detail:{company_name:name}})
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


route.post('/apply',async (req,res)=>{
    console.log(req.body);
    console.log("applying for job")
     var studentId;
     var student;
  Decryptedtoken = decryptToken(req.headers.authorization);
  try {
    await student_basic_details
      .findOne({
        where: {
          emailId: Decryptedtoken.email
        }
      })
      .then(tokenuser => {
        console.log(
          tokenuser.dataValues.student_basic_detail_id + "in details"
        );
        student=tokenuser.dataValues
        studentId = tokenuser.dataValues.student_basic_detail_id;
        email = tokenuser.dataValues.emailId;
        name= tokenuser.dataValues.name;

      })
      .catch(err =>{
        console.log(`error getting student basic details ${err}`)
      });
   
//    const jobresult= await job.getStudent_basic_details()
//    console.log(jobresult)

        // const apply=await studentjob.create({
        //     jobJobId:req.body.job_id,
        //     studentBasicDetailStudentBasicDetailId:studentId
        // })
     //   res.status(201).send(apply)
    console.log(student,'-----------------------------------',req.body.job.job_id)
    const result=await studentjobs.create({
        
             job_id:req.body.job.job_id,
             studentBasicDetailStudentBasicDetailId:student.student_basic_detail_id
        
    })
    if(result)
    {
        res.status(201).send(result)
    }
    //  const jobid=await job.findOne({
    //      where:{
    //          job_id:req.body.job.job_id
    //      },
    //      include:[{
    //          model:student_basic_details, as:'student_basic_details'
           
    //      }]
    //  })

    //  if(jobid)
    //  {
         
    //         console.log(student+"this is student")
    //       const result=await jobid.createStudent_basic_detail(student)
    //       console.log(result)
    //       res.status(201).send(res)
    //  }


    
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

route.get('/applicants',async(req,res)=>{
     console.log("----------getting jobs")
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
          tokenuser.dataValues.student_basic_detail_id + "in details ------------------------"
        );
        companyId = tokenuser.dataValues.company_basic_detail_id;
        email = tokenuser.dataValues.emailId;
        name= tokenuser.dataValues.company_name;

      })
      .catch(err =>{
        console.log(`error posting student journey ${err}`)
      });
    
      const result = await job.findAll({
          where:{
              company_basic_detail_id:companyId
          }
      }
      )
      console.log("sending jobs-----------------"+result)
      res.status(201).send(
        {
          result:result 
        }
      )
}
catch(err)
{
  console.log(`error getting jobs ${err}`)
  res.status(500).send({
    errors: {
      body: err
    }

})
}
})

route.post('/upload',async  (req, res, next) => {
  
  console.log(req.body);
    console.log("applying for job")
     var studentId;
     var student;
  Decryptedtoken = decryptToken(req.headers.authorization);
  try {
    await student_basic_details
      .findOne({
        where: {
          emailId: Decryptedtoken.email
        }
      })
      .then(tokenuser => {
        console.log(
          tokenuser.dataValues.student_basic_detail_id + "in details"
        );
        student=tokenuser.dataValues
        studentId = tokenuser.dataValues.student_basic_detail_id;
        email = tokenuser.dataValues.emailId;
        name= tokenuser.dataValues.name;

      })
      .catch(err =>{
        console.log(`error getting student basic details ${err}`)
      });
   

  console.log(req.body.id+"this is the id");
  var bookId=req.body.id
  let file = req.files.file;

  upload(req, res, function (err) {
    
    console.log('here in uploading file')
    console.log(req.files)
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }
           console.log(req.file);
    //  return res.status(200).send(req.file)

    })

    console.log(student,'-----------------------------------',bookId)
    const result=await studentjobs.create({
           
             job_id:bookId,
             jobJobId:bookId,
             student_basic_detail_id:student.student_basic_detail_id
        
    })
    if(result)
    {
        res.status(201).send(result)
    }
}
catch(err)
{
  console.log(err)
  res.status(403).send(err.name)
}
})

route.get('/applied',async(req,res)=>{
     console.log("----------getting applied jobs")
  Decryptedtoken = decryptToken(req.headers.authorization);
  try {
    await student_basic_details
      .findOne({
        where: {
          emailId: Decryptedtoken.email
        }
      })
      .then(tokenuser => {
        console.log(
          tokenuser.dataValues.student_basic_detail_id + "in details ------------------------"
        );
        studentId = tokenuser.dataValues.student_basic_detail_id;
        email = tokenuser.dataValues.emailId;
        name= tokenuser.dataValues.name;

      })
      .catch(err =>{
        console.log(`error posting student journey ${err}`)
      });
    
     

      const finalresult= await job.findAll({
         
           include:[{
              model:company_basic_details
        
          },
          {
            model:studentjobs,
            where:{
              student_basic_detail_id:studentId
            }
          }
          ]

      })    
      
      console.log("sending jobs-----------------"+finalresult)
      res.status(201).send(
        {
          result:finalresult 
        }
      )
}
catch(err)
{
  console.log(`error getting jobs ${err}`)
  res.status(500).send({
    errors: {
      body: err
    }

})
}
})


module.exports=route;