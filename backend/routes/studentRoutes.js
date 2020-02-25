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
const {
  student_basic_details
  // student_profile,
  // student_education,
  // student_skills
} = require("../db/index");
const {
  student_profile,
  student_education,
  student_skills,student_experience
} = require("../db/studentmodel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

route.get("/", async (req, res) => {
  
  console.log(req.headers);
  Decryptedtoken = decryptToken(req.headers.authorization);
  let studentId, email;

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
        student_basic_detail_id: studentId
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
      student_basic_detail_id: studentId
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
      student_basic_detail_id: studentId
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

route.post("/login", validateEmail, validatePassword, async (req, res) => {
  console.log(req.body.student.email);
  console.log("In login");

  const studenttoken = await generateToken(req.body.student.email);
  try {
    const student = await student_basic_details.findOne({
      where: {
        emailId: req.body.student.email
      }
    });
    // console.log(student)
    if (student) {
      bcrypt.compare(req.body.student.password, student.password, function(
        err,
        isMatch
      ) {
        console.log(bcrypt.hashSync(req.body.student.password, 10));
        console.log(student.password);
        if (err) {
          res.status(500).send({
            errors: {
              body: err
            }
          });
        } else if (!isMatch) {
          res.status(403).send({
            errors: {
              body: "Unauthenticated User"
            }
          });
        } else {
          console.log("succesfully logged in");
          res.status(201).send({
            user: {
              emailId: student.email,
              name: student.name,
              image: null,
              token: studenttoken
            }
          });
        }
      });
    } else {
      res.status(401).send({
        errors: {
          body: "Unauthorised User"
        }
      });
    }
  } catch (err) {
    res.status(500).send({
      errors: {
        body: err
      }
    });
  }
});

module.exports = route;
