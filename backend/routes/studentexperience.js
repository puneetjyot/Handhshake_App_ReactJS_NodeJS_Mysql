var express = require("express");
var route = express.Router();
const { generateToken, decryptToken } = require("../service/tokenservice");
const { generateUUID } = require("../service/uuidservice");
const passport = require("../authenticate/passport_init");
const key = require("../service/key");
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
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

route.get("/", async (req, res) => {
  Decryptedtoken = decryptToken(req.headers.authorization);
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
        name = tokenuser.dataValues.name;
      })
      .catch(err => {
        console.log(`error getting student basic details ${err}`);
      });
  } else {
    return res.json({
      errors: {
        message: [Decryptedtoken.error]
      }
    });
  }
  try {
    const experiencearr = await student_experience.findAll({
      where: {
        student_basic_detail_id: studentId
      }
    });

    if (experiencearr) {
      res.status(201).send({
        experiencearr
      });
    }
  } catch (err) {
    res.status(403).send({
      errors: {
        err: "Unable to delete school"
      }
    });
  }
});

route.post("/", async (req, res) => {
  Decryptedtoken = decryptToken(req.headers.authorization);
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
        name = tokenuser.dataValues.name;
      })
      .catch(err => {
        console.log(`error getting student basic details ${err}`);
      });
  } else {
    return res.json({
      errors: {
        message: [Decryptedtoken.error]
      }
    });
  }
  try {
    const experiencearr = await student_experience.create({
      student_basic_detail_id: studentId,
      job_id: req.body.experience.job_id,
      job_title: req.body.experience.job_title,
      employer: req.body.experience.employer,
      start_time: req.body.experience.start_time,
      end_time: req.body.experience.end_time,
      location: req.body.experience.location,
      description: req.body.experience.description
    });

    if (experiencearr) {
      res.status(201).send({
        experiencearr
      });
    }
  } catch (err) {
    console.log(err);
    res.status(403).send({
      errors: {
        err: "Unable to ADD experience"
      }
    });
  }
});

function checkNull(value) {
  var val = value ? value : " ";
  return val;
}

route.put("/", async (req, res) => {
  Decryptedtoken = decryptToken(req.headers.authorization);
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
        name = tokenuser.dataValues.name;
      })
      .catch(err => {
        console.log(`error getting student basic details ${err}`);
      });
  } else {
    return res.json({
      errors: {
        message: [Decryptedtoken.error]
      }
    });
  }
  try {
    const experiencearr = await student_experience.update(
      {
        student_basic_detail_id: checkNull(studentId),
        job_id: checkNull(req.body.experience.job_id),
        job_title: checkNull(req.body.experience.job_title),
        employer: checkNull(req.body.experience.employer),
        start_time: checkNull(req.body.experience.start_time),
        end_time: checkNull(req.body.experience.end_time),
        location: checkNull(req.body.experience.location),
        description: checkNull(req.body.experience.description)
      },

      {
        where: {
          student_basic_detail_id: studentId,
          job_id: req.body.experience.job_id
        }
      }
    );

    if (experiencearr) {


       const newexperiencearr= await student_experience.findAll({
            where:{
                student_basic_detail_id:studentId
            }
        })

      res.status(201).send({
        newexperiencearr
      });
    }
  } catch (err) {
    console.log(err);
    res.status(403).send({
      errors: {
        err: "Unable to ADD experience"
      }
    });
  }
});

route.delete('/', async(req,res)=>{
    console.log();
    console.log("In deleting name");
    var studentId;
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
          studentId = tokenuser.dataValues.student_basic_detail_id;
          email = tokenuser.dataValues.emailId;
          name= tokenuser.dataValues.name;
  
        })
        .catch(err =>{
          console.log(`error getting student basic details ${err}`)
        });
     
        const preeducation= await student_experience.findOne({
          where:{
            job_id:req.body.data.experience.job_id
          }
        }) 
        const result=await preeducation.destroy()
  
        if(result)
        {
          const updatedExperience=await student_experience.findAll({
            where:{
              student_basic_detail_id:studentId
            }
          })
          if(updatedExperience){
            res.status(201).send(updatedExperience)
          }
          else{
            res.status(403).send(
              {
                errors:{
                  err:"Unable to delete school"
            }
          }
          )
          }
         
        }
        else{
          res.status(403).send(
            {
              errors:{
                err:"Unable to delete school"
          }
        }
        )
        }
  
     
     
     
      }
  catch(err)
  {
    console.log(err+"error sdsad");
    res.status(500).send(
    {
  
      errors:{
        body:'cannot delete as record is not present'
      }
  
    }
 
  )
  }
  })
module.exports = route;
