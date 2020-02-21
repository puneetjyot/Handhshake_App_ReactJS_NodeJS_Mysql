const sequelize = require("sequelize");
const DT = sequelize.DataTypes;
const bcrypt = require('bcrypt');
const sequelizeconnection = new sequelize('handshake', 'admin', 'admin#123', {
    host: 'handshake.chf9uwuchcb3.us-east-1.rds.amazonaws.com',
    dialect: 'mysql'/* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
  });

  const company_basic_details = 
sequelizeconnection.define(
    "company_basic_details",
    {
    company_basic_detail_id:
    {
      type: DT.UUID,
      primaryKey: true,
      defaultValue: DT.UUIDV1
    },
    company_name:{
        type:DT.STRING(50),
        allowNull:false,
    },
   
    emailId:{
        type:DT.STRING(50),
        allowNull:false,
        unique:true
    },
    password:{
        type:DT.STRING(200),
        allowNull:false,
        
    },
    location:{
        type:DT.STRING(200),
        allowNull:false,
    }
    },
    {
        hooks : {
            beforeCreate : (company_basic_details , options) => {
                {
                    company_basic_details.password =  company_basic_details.password != "" ? bcrypt.hashSync(company_basic_details.password, 10) : "";
                }
            }
        }
    
    }

)
sequelizeconnection.sync();


module.exports = {
    company_basic_details
}