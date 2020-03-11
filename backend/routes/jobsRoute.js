var express = require("express");
var route = express.Router();
const { generateToken, decryptToken } = require("../service/tokenservice");
const { generateUUID } = require("../service/uuidservice");
const passport = require("../authenticate/passport_init");
const key = require("../service/key");
const fileUpload = require("express-fileupload");
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
const { job, studentjobs } = require("../db/jobmodel");
const { company_basic_details } = require("../db/comapnymodel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var multer = require("multer");
route.use(fileUpload());

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

var upload = multer({ storage: storage });

route.get("/", async (req, res) => {
  console.log("----------getting jobs");
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
      include: [
        {
          model: company_basic_details
        }
      ]
    });
    console.log("sending jobs-----------------" + result);
    res.status(201).send({
      result: result
    });
  } catch (err) {
    console.log(`error getting jobs ${err}`);
    res.status(500).send({
      errors: {
        body: err
      }
    });
  }
});

route.post("/", async (req, res) => {
  console.log("----------getting jobs");
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
        console.log(`posting jobs ${err}`);
      });

    const result = await job.create({
      job_title: req.body.job.job_title,
      deadline: req.body.job.deadline,
      location: req.body.job.location,
      salary: req.body.job.salary,
      job_description: req.body.job.job_description,
      job_category: req.body.job.job_category,
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
          err: "Unable to add school"
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

route.post("/apply", async (req, res) => {
  console.log(req.body);
  console.log("applying for job");
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
        student = tokenuser.dataValues;
        studentId = tokenuser.dataValues.student_basic_detail_id;
        email = tokenuser.dataValues.emailId;
        name = tokenuser.dataValues.name;
      })
      .catch(err => {
        console.log(`error getting student basic details ${err}`);
      });

    //    const jobresult= await job.getStudent_basic_details()
    //    console.log(jobresult)

    // const apply=await studentjob.create({
    //     jobJobId:req.body.job_id,
    //     studentBasicDetailStudentBasicDetailId:studentId
    // })
    //   res.status(201).send(apply)
    console.log(
      student,
      "-----------------------------------",
      req.body.job.job_id
    );
    const result = await studentjobs.create({
      job_id: req.body.job.job_id,
      studentBasicDetailStudentBasicDetailId: student.student_basic_detail_id
    });
    if (result) {
      res.status(201).send(result);
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

route.get("/applicants", async (req, res) => {
  console.log("----------getting jobs");
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
          tokenuser.dataValues.student_basic_detail_id +
            "in details ------------------------"
        );
        companyId = tokenuser.dataValues.company_basic_detail_id;
        email = tokenuser.dataValues.emailId;
        name = tokenuser.dataValues.company_name;
      })
      .catch(err => {
        console.log(`applicants ${err}`);
      });

    const result = await job.findAll({
      where: {
        company_basic_detail_id: companyId
      }
    });
    console.log("sending jobs-----------------" + result);
    res.status(201).send({
      result: result
    });
  } catch (err) {
    console.log(`error getting jobs ${err}`);
    res.status(500).send({
      errors: {
        body: err
      }
    });
  }
});

route.post("/upload/:id",upload.single('myimage'), async (req, res, next) => {
  console.log(req.body);
  console.log("applying for job");
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
        student = tokenuser.dataValues;
        studentId = tokenuser.dataValues.student_basic_detail_id;
        email = tokenuser.dataValues.emailId;
        name = tokenuser.dataValues.name;
      })
      .catch(err => {
        console.log(`error getting student basic details ${err}`);
      });
    //  console.log(JSON.stringify(req.files)+"these are files")
    console.log(req.body.id + "this is the id");
    var bookId = req.body.id;
    let file = req.files.file;
      

    console.log(req.files.file.name+
      "hhjhjhjghjgjgjgjhghjj")

   // console.log(student, "-----------------------------------", bookId);
    const result = await studentjobs.create({
      job_id: req.params.id,
      jobJobId: req.params.id,
      student_basic_detail_id: student.student_basic_detail_id,
      resume:req.files.file
    });
    if (result) {
      res.status(201).send(result);
    }
  } catch (err) {
    console.log(err);
    res.status(403).send(err.name);
  }
});

route.get("/applied", async (req, res) => {
  console.log("----------getting applied jobs");
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
          tokenuser.dataValues.student_basic_detail_id +
            "in details ------------------------"
        );
        studentId = tokenuser.dataValues.student_basic_detail_id;
        email = tokenuser.dataValues.emailId;
        name = tokenuser.dataValues.name;
      })
      .catch(err => {
        console.log(`applying for jobs ${err}`);
      });

    const finalresult = await job.findAll({
      include: [
        {
          model: company_basic_details
        },
        {
          model: studentjobs,
          where: {
            student_basic_detail_id: studentId
          }
        }
      ]
    });

    console.log("sending jobs-----------------" + finalresult);
    res.status(201).send({
      result: finalresult
    });
  } catch (err) {
    console.log(`error getting jobs ${err}`);
    res.status(500).send({
      errors: {
        body: err
      }
    });
  }
});

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
         studentjobs b ON a.student_basic_detail_id = b.student_basic_detail_id
             INNER JOIN
         handshake.student_educations e
     ON
         a.college = e.school_name
             AND a.student_basic_detail_id = e.student_basic_detail_id
             where b.job_id=?
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
            msg: "Successfully fetched student profile",
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


route.post('/:jobId/:studentId',async(req,res)=>{
  try {
    console.log(req.body.company.status)
    Decryptedtoken = decryptToken(req.headers.authorization);
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
        console.log(`getting students who applied for this job ${err}`);
      });


    connection.query(
      `update studentjobs set job_status=? where job_id=? and student_basic_detail_id=?`,
      [req.body.company.status,req.params.jobId,req.params.studentId],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          res.send({
            
            success: false,
            msg: "Something went wrong",
            msgDesc: err
          });
        } else {
          res.send({
            success: true,
            msg: "Successfully fetched student profile",
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
})


module.exports = route;
