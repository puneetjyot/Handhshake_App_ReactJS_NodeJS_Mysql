 const sequelize = require("sequelize");
const DT = sequelize.DataTypes;
const bcrypt = require('bcrypt');
const sequelizeconnection = new sequelize('handshake', 'admin', 'admin#123', {
    host: 'handshake.chf9uwuchcb3.us-east-1.rds.amazonaws.com',
    dialect: 'mysql'/* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
  });
  const {student_basic_details } = require ("./studentmodel");
  const {company_basic_details} = require('./comapnymodel')
  

  const job=
  sequelizeconnection.define(
      "job",
    {
    job_id:
    {
      type: DT.UUID,
      primaryKey: true,
      defaultValue: DT.UUIDV1
    },
     job_title:{
        type:DT.STRING(50),
        allowNull:false,
    },
    deadline:{
        type:DT.DATEONLY
       
    },
   
    location:{
          type:DT.STRING(50),
       
    },
    salary:{
        type:DT.STRING(50)
    },
    job_description:{
        type:DT.TEXT
    },

    job_category:{
        type:DT.STRING(50)
    }
    
    })
// const Grant = sequelize.define('grant', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//     allowNull: false
//   },
//   selfGranted: DataTypes.BOOLEAN
// }, { timestamps: false });
    const studentjobs=

    sequelizeconnection.define(
    "studentjobs",
    {
        
        id:{
          type: DT.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        }

    }
    
    )
  sequelizeconnection.sync()
  console.log("========================================")

    job.belongsTo(company_basic_details,{foreignKey:'company_basic_detail_id'})

    student_basic_details.belongsToMany(job,{through:studentjobs,foreignKey:'student_basic_detail_id'})   
    job.belongsToMany(student_basic_details,{through:studentjobs,foreignKey:'job_id'}) 
    
  module.exports={job,studentjobs}