const {student_basic_details,sequelizeconnection}=require("./studentmodel");
const {company_basic_details}=require("./comapnymodel");
const { Sequelize, DataTypes } = require('sequelize');


  var test = sequelizeconnection.authenticate()
    .then(function () {
        console.log("CONNECTED! ");
    })
    .catch(function (err) {
        console.log(err);
    })
    .done();

    //const student_basic_detail=sequelize.define('student_basic_details',student_basic_details);
    

    module.exports={
        
        student_basic_details,company_basic_details
    }
