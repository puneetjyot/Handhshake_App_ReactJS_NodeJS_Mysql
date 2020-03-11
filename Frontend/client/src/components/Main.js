import React, { Component } from "react";
import { Route } from "react-router-dom";
import LoginStudent from "./LoginStudent";
import Navbar from "./Navbar";
import LoginEmployer from "./LoginEmployer";
import RegisterEmployer from "./RegisterEmployer";
import RegisterStudent from "./RegisterStudent";
import MainProfile from "./mainprofile";
import StudentEvent from "./StudentEvent";
import StudentJobs from "./StudentJobs";
import StudentApplication from "./StudentApplication";
import StudentList from "./StudentList";
import MainVisitedProfile from "./Profile/MainVisitedProfile";
import CompanyHome from "./company/CompanyHome";
import StudentJobList from "./company/StudentJobList";
import StudentEventList from "./company/StudentEventList";
import CompanyEvent from "./company/CompanyEvent";

class Main extends Component {
  render() {
    return (
      <div>
        {/*Render Different Component based on Route*/}
        {/* <Route path="/" component={Navbar}/>
                <Route path="/login" component={Login}/>
                <Route path="/home" component={Home}/>
                <Route path="/delete" component={Delete}/>
                <Route path="/create" component={Create}/> */}

        <Route path="/" component={Navbar} />
        <Route path="/student/login" component={LoginStudent} />
        <Route path="/company/login" component={LoginEmployer} />
        <Route path="/student/register" component={RegisterStudent} />
        <Route path="/company/register" component={RegisterEmployer} />
        <Route path="/company/home" component={CompanyHome} />
        <Route path="/student/home" component={MainProfile} />
        <Route path="/student/events" component={StudentEvent} />
        <Route path="/student/jobs" component={StudentJobs} />
        <Route path="/student/application" component={StudentApplication} />
        <Route path="/student/list" component={StudentList} />
        <Route path="/student/profile/:id" component={MainVisitedProfile} />
        <Route path="/job/student/:id" component={StudentJobList} />
        <Route path="/event/student/:id" component={StudentEventList} />
        <Route path="/company/events" component={CompanyEvent} />
        
        {/* <Route path="/" */}
      </div>
    );
  }
}
//Export The Main Component
export default Main;
