import React, { Component } from "react";
import VisitedProfilePic from "./VisitedProfilePic";
import VisitedPersonalInfo from "./VisitedPersonalInfo";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
 import VisitedJourney from "./VistedJourney";
 import VisitedEducation from "./VisitedEducation";
 import VisitedExperience from "./VisitedExperience"
 import VisitedSkills from './VisitedSkills'
// //import {getEducation} from '../redux/actions/profileAction'

class MainVisitedProfile extends Component {
  state = {};
  componentDidMount(){

   // this.props.getEducation();
   console.log(localStorage.getItem('visitedstudent'))
  }
  render() {
   
   
   
    return (
      <div className="d-flex container">
        <div className="row">
          <div className="col-4">
          
            <VisitedProfilePic profileData={this.props.educationarr} />
            <VisitedSkills/>
             <VisitedPersonalInfo personalData={this.props.educationarr} /> 
          </div>
          <div className="col-8">
            <VisitedJourney />
            <VisitedEducation educationData={this.props.educationarr} />
            
                <VisitedExperience experienceData={this.props.educationarr}/>
             
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

export default MainVisitedProfile