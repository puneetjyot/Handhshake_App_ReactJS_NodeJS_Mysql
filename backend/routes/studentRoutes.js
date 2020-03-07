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
  student_skills,
  student_experience
} = require("../db/studentmodel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

route.get("/", async (req, res) => {
  console.log("In student route" + JSON.stringify(req.headers));
  Decryptedtoken = decryptToken(req.headers.authorization);
  let studentId, email, name;
  let studentBasicDetail = "";
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
        studentBasicDetail= tokenuser.dataValues;
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
    })
    .catch(err => {
      console.log(`error getting student education ${err}`);
    });
  var studentexperiencesarr = [];
  student_experience
    .findAll({
      where: {
        student_basic_detail_id: studentId
      }
    })
    .then(studentexperiences => {
      //console.log("gettong experience"+JSON.stringify(studentexperiences))

      for (var i = 0; i < studentexperiences.length; i++) {
        studentexperiencesarr[i] = studentexperiences[i];
      }
      // console.log(studentexperiences)
      //studentexperiences=studentexperience.dataValues;
    })
    .catch(err => {
      console.log(`error getting student experience ${err}`);
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
      console.log("profile");
      const studenttoken = generateToken(email);
      studentprofile = studentprofile.dataValues;
      console.log(studentBasicDetail);

      res.status(201).json({
        student: {
          email: email,
          name: name,
          career_objective: studentprofile.career_objective,
          profile_picture: studentprofile.profile_picture,
          token: studenttoken,
          education: studentEducations,
          profile: studentprofile,
          experience: studentexperiencesarr,
          student_basic_details: studentBasicDetail
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
    })
    .catch(err => {
      console.log(`error getting student profile ${err}`);
    });
});

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
route.post("/journey", async (req, res) => {
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
        name = tokenuser.dataValues.name;
      })
      .catch(err => {
        console.log(`error posting student journey ${err}`);
      });

    const result = await student_profile.update(
      { career_objective: req.body.student.career_objective },
      { where: { student_basic_detail_id: studentId } }
    );
    res.status(201).send({
      result: req.body.student.career_objective
    });
  } catch (err) {
    console.log(`error posting student journey ${err}`);
    res.status(500).send({
      errors: {
        body: err
      }
    });
  }
});
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

route.get("/journey", async (req, res) => {
  console.log("----------getting journey");
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
        console.log(`error posting student journey ${err}`);
      });

    const result = await student_profile.findOne({
      where: { student_basic_detail_id: studentId }
    });
    console.log("sending journey-----------------" + result.career_objective);
    res.status(201).send({
      result: result.career_objective
    });
  } catch (err) {
    console.log(`error posting student journey ${err}`);
    res.status(500).send({
      errors: {
        body: err
      }
    });
  }
});

route.put("/name", async (req, res) => {
  console.log(req.body);
  console.log("In updating name");
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
        name = tokenuser.dataValues.name;
      })
      .catch(err => {
        console.log(`error getting student basic details ${err}`);
      });
    const result = await student_basic_details.update(
      { name: req.body.student.name },
      { where: { student_basic_detail_id: studentId } }
    );
    res.status(201).send({
      student: {
        name: req.body.student.name
      }
    });
  } catch (err) {
    res.status(403).send({
      error: {
        error: err
      }
    });
  }
});

route.post("/education", async (req, res) => {
  console.log(req.body);
  console.log("In updating name");
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
        name = tokenuser.dataValues.name;
      })
      .catch(err => {
        console.log(`error getting student basic details ${err}`);
      });

    const result = await student_education.create({
      student_basic_detail_id: studentId,
      school_name: req.body.education.schoolname,
      education_level: req.body.education.educationlevel,
      major: req.body.education.major,
      minor: req.body.education.minor ? req.body.education.minor : "",
      start_time: req.body.education.startDate,
      end_time: req.body.education.endDate,
      GPA: req.body.education.gpa
    });

    if (result) {
      res.status(201).send(result);
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

route.put("/education", async (req, res) => {
  console.log(req.body);
  console.log("In updating name");
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
        name = tokenuser.dataValues.name;
      })
      .catch(err => {
        console.log(`error getting student basic details ${err}`);
      });

    const preeducation = await student_education.findOne({
      where: {
        education_id: req.body.education.educationId
      }
    });
    const result = await student_education.update(
      {
        school_name: req.body.education.schoolname
          ? req.body.education.schoolname
          : preeducation.school_name,
        education_level: req.body.education.education_level
          ? req.body.education.education_level
          : preeducation.education_level,
        major: req.body.education.major
          ? req.body.education.major
          : preeducation.major,
        minor: req.body.education.minor ? req.body.education.minor : "",
        start_time: req.body.education.startDate
          ? req.body.education.startDate
          : preeducation.start_time,
        end_time: req.body.education.endDate
          ? req.body.education.endDate
          : preeducation.end_time,
        GPA: req.body.education.gpa ? req.body.education.gpa : preeducation.GPA
      },
      {
        where: {
          student_basic_detail_id: studentId,
          education_id: req.body.education.educationId
        }
      }
    );

    if (result) {
      const updateEducation = await student_education.findAll({
        where: {
          student_basic_detail_id: studentId
        }
      });
      if (updateEducation) {
        res.status(201).send(updateEducation);
      } else {
        res.status(403).send({
          errors: {
            err: "Unable to update school"
          }
        });
      }
    } else {
      res.status(403).send({
        errors: {
          err: "Unable to update school"
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

route.delete("/education", async (req, res) => {
  console.log(req.body);
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
        name = tokenuser.dataValues.name;
      })
      .catch(err => {
        console.log(`error getting student basic details ${err}`);
      });

    const preeducation = await student_education.findOne({
      where: {
        education_id: req.body.data.education.educationId
      }
    });
    const result = await preeducation.destroy();

    if (result) {
      const updatedEducation = await student_education.findAll({
        where: {
          student_basic_detail_id: studentId
        }
      });
      if (updatedEducation) {
        res.status(201).send(updatedEducation);
      } else {
        res.status(403).send({
          errors: {
            err: "Unable to delete school"
          }
        });
      }
    } else {
      res.status(403).send({
        errors: {
          err: "Unable to delete school"
        }
      });
    }
  } catch (err) {
    console.log(err + "error sdsad");
    res.status(500).send({
      errors: {
        body: "cannot delete as record is not present"
      }
    });
  }
});
route.get("/education", async (req, res) => {
  console.log(req.body);
  console.log("In get education");
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
        name = tokenuser.dataValues.name;
      })
      .catch(err => {
        console.log(`error getting student basic details ${err}`);
      });

    const preeducation = await student_education.findAll({
      where: {
        student_basic_detail_id: studentId
      }
    });

    if (preeducation) {
      res.status(201).send(preeducation);
    } else {
      res.status(403).send({
        errors: {
          err: "Unable to delete school"
        }
      });
    }
  } catch (err) {
    console.log(err + "error sdsad");
    res.status(500).send({
      errors: {
        body: "cannot delete as record is not present"
      }
    });
  }
});

route.post("/picture", async (req, res) => {
  console.log(req.body);
  console.log("In updating name");
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
        name = tokenuser.dataValues.name;
      })
      .catch(err => {
        console.log(`error getting student basic details ${err}`);
      });

    const result = await student_profile.update(
      { profile_picture: req.body.student.profile_picture },
      { where: { student_basic_detail_id: studentId } }
    );

    if (result) {
      //  res.status(201).send({picture:{req.body.student.profile_picture}})
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

route.post("/skills", async (req, res) => {
  console.log(req.body);
  console.log("In posting skills");
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
        name = tokenuser.dataValues.name;
      })
      .catch(err => {
        console.log(`error getting student basic details ${err}`);
      });

    console.log(req.body.student.skill_name);
    const result = await student_skills.create({
      student_basic_detail_id: studentId,
      skill_name: req.body.student.skill_name
    });
    // console.log(result)
    if (result) {
      res.status(201).send({
        result
      });
    } else {
      res.status(403).send({
        error: {
          error: "Cant add skill"
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

///// Get for skills

route.get("/skills", async (req, res) => {
  console.log(req.body);
  console.log("In get education");
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
        name = tokenuser.dataValues.name;
      })
      .catch(err => {
        console.log(`error getting student basic details ${err}`);
      });

    const preeducation = await student_skills.findAll({
      where: {
        student_basic_detail_id: studentId
      }
    });

    if (preeducation) {
      res.status(201).send(preeducation);
    } else {
      res.status(403).send({
        errors: {
          err: "Unable to get skills"
        }
      });
    }
  } catch (err) {
    console.log(err + "error sdsad");
    res.status(500).send({
      errors: {
        body: "cannot find key as record is not present"
      }
    });
  }
});

route.delete("/skills", async (req, res) => {
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
        name = tokenuser.dataValues.name;
      })
      .catch(err => {
        console.log(`error getting student basic details ${err}`);
      });

    const skills = await student_skills.findOne({
      where: {
        skill_id: req.body.data.skills.skill_id
      }
    });
    const result = await skills.destroy();

    if (result) {
      const updatedskills = await student_skills.findAll({
        where: {
          student_basic_detail_id: studentId
        }
      });
      if (updatedskills) {
        res.status(201).send(updatedskills);
      } else {
        res.status(403).send({
          errors: {
            err: "Unable to delete skill"
          }
        });
      }
    } else {
      res.status(403).send({
        errors: {
          err: "Unable to delete skill"
        }
      });
    }
  } catch (err) {
    console.log(err + "error sdsad");
    res.status(500).send({
      errors: {
        body: "cannot delete as record is not present"
      }
    });
  }
});

route.post("/basicdetails", async (req, res) => {
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
        name = tokenuser.dataValues.name;
      })
      .catch(err => {
        console.log(`error posting student journey ${err}`);
      });

    const result = await student_profile.update(
      // { career_objective: req.body.student.career_objective },
      // { where: { student_basic_detail_id: studentId } }
      {
        dob:req.body.basicdetails.dob?req.body.basicdetails.dob:'',
        studentstate:req.body.basicdetails.studentstate?req.body.basicdetails.studentstate:'',
        city:req.body.basicdetails.city?req.body.basicdetails.city:'',
        country:req.body.basicdetails.country?req.body.basicdetails.country:'',
        email:req.body.basicdetails.email?req.body.basicdetails.email:'',
        phone:req.body.basicdetails.phone?req.body.basicdetails.phone:''
      },
      {where:{student_basic_detail_id:studentId}}
    );
    res.status(201).send({
      result: {
        "student":{
          "email":req.body.basicdetails.email?req.body.basicdetails.email:'',
          "student_basic_details":{
            
            "dob": req.body.basicdetails.dob?req.body.basicdetails.dob:'',   
            "city": req.body.basicdetails.city?req.body.basicdetails.city:'',
            "state": req.body.basicdetails.studentstate?req.body.basicdetails.studentstate:'',
            "country": req.body.basicdetails.country?req.body.basicdetails.country:'',
            "phone_number": req.body.basicdetails.phone?req.body.basicdetails.phone:''
          }
        }
      }
    });
  } catch (err) {
    console.log(`error posting student journey ${err}`);
    res.status(500).send({
      errors: {
        body: err
      }
    });
  }
});

module.exports = route;
