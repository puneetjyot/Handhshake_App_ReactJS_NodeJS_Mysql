var express = require('express');
var route = express.Router();
const {generateToken,decryptToken}=require('../service/tokenservice');
const {generateUUID}=require('../service/uuidservice');
const passport = require('../authenticate/passport_init')
const key=require('../service/key');
const {validateUsername,validatePassword,validateEmail} =require('../companymiddleware');
const { company_basic_details }  = require('../db/index');
const jwt = require('jsonwebtoken');
var connection = require('../db_connection');
const bcrypt = require('bcrypt');
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


route.get('/',async(req,res)=>{
     console.log("----------getting all profiles")
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
    
    //   const result = await student_education.findAll({
    //       include:[{
    //             model:student_basic_details,
    //             where:{school_name:student_basic_details.college}
    //       }]
    //   });

        connection.query(
            `SELECT * FROM handshake.student_basic_details
                inner join handshake.student_educations
                where student_basic_details.college=student_educations.school_name and student_basic_details.student_basic_detail_id=student_educations.student_basic_detail_id`,
     (err, results, fields) => {
      if(err) {
        res.send({
            success: false,
            msg: "Something went wrong",
            msgDesc: err
        })
      } else {

            res.send({
              success: true,
              msg: "Successfully fetched student profile" ,
              msgDesc: results
          }) 
      } 
    })

    //   console.log("sending jobs-----------------"+result)
    //   res.status(201).send(
    //     {
    //       result:result 
    //     }
    //   )
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

route.get("/:id", async (req, res) => {
  
  console.log("In student route"+JSON.stringify(req.headers));
  Decryptedtoken = decryptToken(req.headers.authorization);
  let studentId, email, name;

  console.log(Decryptedtoken.email);
  if (Decryptedtoken.email !== null) {
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
        studentId = tokenuser.dataValues.student_basic_detail_id;
        email = tokenuser.dataValues.emailId;
        name= tokenuser.dataValues.name;

      })
      .catch(err =>{
        console.log(`error getting student basic details ${err}`)
      });
  } else {
    return res.json({
      errors: {
        message: [Decryptedtoken.error]
      }
    });
  }

  let studentEducations = [];
  let allEducation = student_education
    .findAll({
      where: {
        student_basic_detail_id: req.params.id
      }
    })
    .then(student_educations => {
      // studentEducation=;
      
      for (var i = 0; i < student_educations.length; i++) {
        studentEducations[i] = student_educations[i].dataValues;
      }
      console.log(studentEducations);
    }).catch(err =>{
      console.log(`error getting student education ${err}`)
    });;
var studentexperiencesarr=[];
student_experience.findAll({
where: {
      student_basic_detail_id: req.params.id
    }
  })
.then(studentexperiences =>{
  //console.log("gettong experience"+JSON.stringify(studentexperiences))

  for (var i = 0; i < studentexperiences.length; i++) {
    studentexperiencesarr[i] = studentexperiences[i];
  }
 // console.log(studentexperiences)
  //studentexperiences=studentexperience.dataValues;
}).catch(err =>{
  console.log(`error getting student experience ${err}`)
});
// try{
//   student_skills_list=  await student_basic_details.hasSkill()
//   console.log(student_skills_list)
// }
// catch(e){
//   console.log(e)
// }
student_profile
  .findOne({
    where: {
      student_basic_detail_id: req.params.id
    }
  })
  .then(studentprofile => {
    console.log("profile")
    const studenttoken = generateToken(email);
    studentprofile = studentprofile.dataValues;
    console.log(studentprofile);
    res.status(201).json({
      student: {
        email: email,
        name:name,
        career_objective: studentprofile.career_objective,
        profile_picture: studentprofile.profile_picture,
        token: studenttoken,
        education:studentEducations,
        profile:studentprofile,
        experience:studentexperiencesarr
        // education:
        // {
        //   schoolname:studentEducation.school_name,
        //   educationlevel:studentEducation.education_level,
        //   starttime:studentEducation.start_time,
        //   endtime:studentEducation.end_time,
        //   major:studentEducation.major,
        //   minor:studentEducation.minor,
        //   gpa:studentEducation.GPA,
        //   gpaBoolean:studentEducation.GPAboolean,

        // }
      }
    });
  }).catch(err =>{
    console.log(`error getting student profile ${err}`)
  });;
})




module.exports=route;