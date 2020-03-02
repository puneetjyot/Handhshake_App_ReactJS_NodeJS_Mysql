const sequelize = require("sequelize");
const DT = sequelize.DataTypes;
const bcrypt = require('bcrypt');
const sequelizeconnection = new sequelize('handshake', 'admin', 'admin#123', {
    host: 'handshake.chf9uwuchcb3.us-east-1.rds.amazonaws.com',
    dialect: 'mysql'/* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
  });

const student_basic_details = 
sequelizeconnection.define(
    "student_basic_details",
    {
    student_basic_detail_id:
    {
      type: DT.UUID,
      primaryKey: true,
      defaultValue: DT.UUIDV1
    },
    name:{
        type:DT.STRING(50),
        allowNull:false,
    },
    dob:{
        type:DT.DATEONLY
       
    },
    college:{
        type:DT.STRING(50),
        allowNull:false,
    },
    city:{
        type:DT.STRING(50)
    },
    state:{
        type:DT.STRING(50)
    },
    country:{
        type:DT.STRING(50)
    },
    emailId:{
        type:DT.STRING(50),
        allowNull:false,
        unique:true
    },
    password:{
        type:DT.STRING(200),
        allowNull:false,
        
    }
    },
    {
        hooks : {
            beforeCreate : (student_basic_details , options) => {
                {
                    student_basic_details.password =  student_basic_details.password != "" ? bcrypt.hashSync(student_basic_details.password, 10) : "";
                }
            }
        }
    
    }

)

const student_profile=
    sequelizeconnection.define(
        "student_profile",
        {
            student_profile_id:{
                type:DT.UUID,
                primaryKey: true,
                defaultValue: DT.UUIDV1

            },
            career_objective:{
                type:DT.STRING(200)
            },
            profile_picture:{
                type:DT.BLOB
            },
            resume:{
                type:DT.STRING(200)
            }
            
        }
    )

const student_education=
    sequelizeconnection.define(
        "student_education",
        {
            education_id:{
                type:DT.UUID,
                primaryKey: true,
                defaultValue: DT.UUIDV1
            },
            school_name:{
                type:DT.STRING(50)
            },
            education_level:{
                type:DT.STRING(50)
            },
            start_time:{
                type:DT.DATEONLY
            },
            end_time:{
                type:DT.DATEONLY
            },
            major:{
                type:DT.STRING(50)
            },
            minor:{
                type:DT.STRING(50)
            },
            GPA:{
                type:DT.STRING(50)
            },
            GPAboolean:{
                type:DT.BOOLEAN
            }

        }
    )
    const student_experience=
    sequelizeconnection.define(
        "student_experience",
        {
            job_id:{
                type:DT.UUID,
                primaryKey: true,
                defaultValue: DT.UUIDV1
            },
            job_title:{
                type:DT.STRING(50)
            },
            employer:{
                type:DT.STRING(50)
            },
            start_time:{
                type:DT.DATEONLY
            },
            end_time:{
                type:DT.DATEONLY
            },

            location:{
                type:DT.STRING(50)
            },
            still_working_boolean:{
                type:DT.BOOLEAN
            },
            description:{
                type:DT.STRING(500)
            }

        }
    )

    const student_skills= sequelizeconnection.define("student_skills",{
        skill_id:
        {
        type:DT.UUID,
        primaryKey: true,
        defaultValue: DT.UUIDV1
    },
        skill_name:{
            type:DT.STRING(50)
        }
    })

sequelizeconnection.sync()

student_profile.belongsTo(student_basic_details,{foreignKey:'student_basic_detail_id'})
student_education.belongsTo(student_basic_details,{foreignKey:'student_basic_detail_id'})
student_experience.belongsTo(student_basic_details,{foreignKey:'student_basic_detail_id'})
student_skills.belongsToMany(student_basic_details,{through :'student_skills_relation'})
student_basic_details.belongsToMany(student_skills,{through :'student_skills_relation'})

module.exports = {
    student_basic_details,sequelizeconnection,student_profile,student_education,student_skills,student_experience
}