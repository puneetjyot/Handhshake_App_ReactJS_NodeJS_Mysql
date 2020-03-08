import React, { Component } from "react";
import ProfilePic from "./profilepic";
import PersonalInfo from "./PersonalInfo";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Journey from "./Journey";
import Education from "./Education";
import Experience from "./experience"
import Skills from './skills'
import {getEducation} from '../redux/actions/profileAction'

class MainProfile extends Component {
  state = {};
  componentDidMount(){
    this.props.getEducation();
  }
  render() {
   
    if (!localStorage.getItem('student')) {
      return <Redirect to="/student/login" />;
    }
    else{
        // this.props.getEducation()
    }
    return (
      <div className="d-flex container">
        <div className="row">
          <div className="col-4">
            <ProfilePic profileData={this.props.educationarr} />
            <Skills/>
            <PersonalInfo personalData={this.props.educationarr} />
          </div>
          <div className="col-8">
            <Journey />
            <Education educationData={this.props.educationarr} />
            
                <Experience experienceData={this.props.educationarr}/>
             
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log(state);
  return {
    authStudent: state.auth.authStudent,
    educationarr:state.profileReducer.educationarr
    // authCompany: state.auth.authCompany
  };
};
const mapDispatchToProps = dispatch => {
    return {
        getEducation:  ()=> dispatch(getEducation())
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(MainProfile);
