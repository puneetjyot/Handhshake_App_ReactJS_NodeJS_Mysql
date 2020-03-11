var express = require("express");
var route = express.Router();
const { generateToken, decryptToken } = require("../service/tokenservice");
const { generateUUID } = require("../service/uuidservice");
const passport = require("../authenticate/passport_init");
const key = require("../service/key");
var connection = require("../db_connection");
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
    event,studentevents
} = require('../db/eventmodel')
const {company_basic_details} =require('../db/comapnymodel')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");



route.get('/',async(req,res)=>{
     console.log("----------getting jobs")
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
        console.log(`getting joibs ${err}`)
      });
    
      const result = await event.findAll({
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

route.post('/register',async  (req, res, next) => {
  
  console.log(req.body);
    console.log("registering for event")
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
    
    //getting major of current college
        const current_major_college = await student_education.findOne({
            where:{
                student_basic_detail_id:studentId,
                school_name:student.college
            }
        })
        console.log(current_major_college)
    let major =current_major_college.dataValues.major;
    console.log("-------------------------------------------------------",major)
 
    console.log(student,'-----------------------------------',req.body.event.major)

    if(req.body.event.major.toLowerCase().includes('all')||req.body.event.major.toLowerCase().includes(major.toLowerCase()))
    {
    const result=await studentevents.create({
           
             event_detail_id:req.body.event.event_id,
             student_basic_detail_id:student.student_basic_detail_id
    
    })
    if(result)
    {
        res.status(201).send(result)
    }
    }
    else{
        res.status(403).send({
            eligible:'Not Eligible'
        })
    }
}
catch(err)
{
  console.log(err)
  res.status(403).send(err.name)
}
})


route.get('/registered',async(req,res)=>{
     console.log("----------getting jobs")
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
        console.log(`register for event ${err}`)
      });
    
      const result = await studentevents.findAll({

        where:{
            student_basic_detail_id:studentId
        }      
    
      }
      )

        let eventIdArr=[]
      result.map(i=>{
          eventIdArr.push(i.event_detail_id)
      })
      console.log(eventIdArr);

      const finalresult= await event.findAll({
          where:{
              event_detail_id:eventIdArr
          },
           include:[{
              model:company_basic_details
           
          }]

      })    
      
     
      console.log("sending jobs-----------------"+result)
      res.status(201).send(
        {
          result:finalresult 
        }
      )
}
catch(err)
{
  console.log(`error getting events ${err}`)
  res.status(500).send({
    errors: {
      body: err
    }

})
}
})

route.post('/isregistered',async(req,res)=>{
     console.log("----------getting registered events")
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
        console.log(`error while getting if register  ${err}`)
      });
    
      const result = await studentevents.findOne({

        where:{
            student_basic_detail_id:studentId,
            event_detail_id:req.body.event.event_id
        }      
    
      }
      )
      if(result)
      {
    console.log("sending jobs-----------------"+result)
      res.status(201).send(
        {
          result:{
              registered:true
          } 
        }
      )
      }
      else{
          console.log("sending jobs-----------------"+result)
      res.status(201).send(
        {
          result:{
              registered:false
          } 
        }
      )
      }

      

        
      
     
      
}
catch(err)
{
  console.log(`error getting events ${err}`)
  res.status(500).send({
    errors: {
      body: err
    }

})
}
})



route.get("/:id/students", async (req, res) => {
  console.log("----------getting all students");
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
          tokenuser.dataValues.company_basic_detail_id +
            "in details ------------------------"
        );
        studentId = tokenuser.dataValues.company_basic_detail_id;
        email = tokenuser.dataValues.emailId;
        name = tokenuser.dataValues.company_name;
      })
      .catch(err => {
        console.log(`getting students who applied for this job ${err}`);
      });

    connection.query(
      `SELECT 
         a.*,b.*,e.*
     FROM
         handshake.student_basic_details as a
        
          INNER JOIN
         studentevents b ON a.student_basic_detail_id = b.student_basic_detail_id
             INNER JOIN
         handshake.student_educations e
     ON
         a.college = e.school_name
             AND a.student_basic_detail_id = e.student_basic_detail_id
             where b.event_detail_id=?
             `,
      [req.params.id],
      (err, results, fields) => {
        if (err) {
          res.send({
            success: false,
            msg: "Something went wrong",
            msgDesc: err
          });
        } else {
          res.send({
            success: true,
            msg: "Successfully fetched student registered for events",
            msgDesc: results
          });
        }
      }
    );

  } catch (err) {
    console.log(`error getting jobs ${err}`);
    res.status(500).send({
      errors: {
        body: err
      }
    });
  }
});

route.post('/', async(req,res)=>{
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
          tokenuser.dataValues.company_basic_detail_id +
            "in details ------------------------"
        );
        companyId = tokenuser.dataValues.company_basic_detail_id;
        email = tokenuser.dataValues.emailId;
        name = tokenuser.dataValues.company_name;
      })
      .catch(err => {
        console.log(`posting events ${err}`);
      });

    const result = await event.create({
      event_name: req.body.event.event_name,
      event_time: req.body.event.event_time,
      location: req.body.event.location,
      eligibility: req.body.event.eligibility,
      date: req.body.event.date,
      event_description: req.body.event.event_description,
      company_basic_detail_id: companyId
    });

    if (result) {
      res
        .status(201)
        .send({
          ...result.dataValues,
          company_basic_detail: { company_name: name }
        });
    } else {
      res.status(403).send({
        errors: {
          err: "Unable to add event"
        }
      });
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




module.exports=route;