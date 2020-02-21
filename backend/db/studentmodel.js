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

sequelizeconnection.sync()


module.exports = {
    student_basic_details,sequelizeconnection
}