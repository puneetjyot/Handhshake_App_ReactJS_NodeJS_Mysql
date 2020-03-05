const sequelize = require("sequelize");
const DT = sequelize.DataTypes;
const bcrypt = require('bcrypt');
const sequelizeconnection = new sequelize('handshake', 'admin', 'admin#123', {
    host: 'handshake.chf9uwuchcb3.us-east-1.rds.amazonaws.com',
    dialect: 'mysql'/* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
  });
  const {student_basic_details } = require ("./studentmodel");
  const {company_basic_details} = require('./comapnymodel')


  const event=
  sequelizeconnection.define(
      "event",
    {
    event_detail_id:
    {
      type: DT.UUID,
      primaryKey: true,
      defaultValue: DT.UUIDV1
    },
     event_name:{
        type:DT.STRING(50),
        allowNull:false,
    },
    date:{
        type:DT.DATEONLY
       
    },
    event_time:{
        type:DT.TIME
    },
    location:{
          type:DT.STRING(50),
       
    },
    eligibility:{
        type:DT.STRING(50)
    },
     event_description:{
        type:DT.TEXT
    }
    })

   const studentevents=

    sequelizeconnection.define(
    "studentevents",
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

   event.belongsTo(company_basic_details,{foreignKey:'company_basic_detail_id'})
    student_basic_details.belongsToMany(event,{through:studentevents,foreignKey:'student_basic_detail_id'})   
    event.belongsToMany(student_basic_details,{through:studentevents,foreignKey:'event_detail_id'}) 

  module.exports={event,studentevents}