import React, { Component } from "react";

import "../styles/navbar.css";
import PropTypes from "prop-types";
import { logoutCompany } from "../redux/actions/authAction";
import { logoutStudent } from "../redux/actions/authAction";
import { connect } from "react-redux";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: false
    };
  }
  componentWillMount() {}

  render() {
    var isActive =
      this.context.router.route.location.pathname === this.props.to;
    var className = isActive ? "active" : "";
    var liClasses = `nav-link ${className}`;

    // if (this.props.authCompany || this.props.authStudent) {
    //   console.log("auth true");
    //   var auth = true;
    // }
    if(localStorage.getItem("student")||localStorage.getItem("company"))
    {
       console.log("auth true");
       var auth = true;
    }
   
    return !auth ? (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <button
            className="navbar-toggler navbar-toggler-right"
            type="button"
            data-toggle="collapse"
            data-target="#navbarTogglerDemo02"
            aria-controls="navbarTogglerDemo02"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <a
            className="navbar-brand"
            style={{ color: "#dc3545", fontWeight: "800", fontSize: "150%" }}
            href="/"
          >
            Handshake
          </a>

          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav mr-auto mt-2 mt-md-0">
              <li className="nav-item">
                <a
                  className={liClasses}
                  href="/student/login"
                  style={{ fontWeight: "500" }}
                >
                  Students
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={liClasses}
                  href="/company/login"
                  style={{ fontWeight: "500" }}
                >
                  Employers
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    ) : (
      <nav className="navbar  navbar-light bg-light">
        <div className="d-flex">
        <div>
          <a
            className="navbar-brand"
            style={{ color: "#dc3545", fontWeight: "800", fontSize: "150%" }}
            href="/"
          >
            Handshake
          </a>
          
        </div>
        <div className="d-flex">
        <ion-icon name="search" style={{
    position: "absolute",
    height: "14px",
    width: "20px",
    top: "50%",left: "265px",
    marginLeft: "10px",
    size:"13px"
    }}
 size="large" ></ion-icon>
          <input type="text" id="navsearch" className="form-control mt-2 mx-2 mr-sm-2 pl-4 " style={{marginRight:"15px"}} placeholder="search" ></input>
          </div>
        </div>
        <div className="d-flex">
        <div>
        {localStorage.getItem("student")?
          <a
          className={liClasses}
          style={{  fontWeight: "500",color:'rgba(0,0,0,.5)' }}
            href="/student/home"
          >
            Profile
          </a>
          :
           <a
          className={liClasses}
          style={{  fontWeight: "500",color:'rgba(0,0,0,.5)' }}
            href="/company/home"
          >
            Home
          </a>
        }
          </div>
        <div>
        {localStorage.getItem("student")?
          <a
          className={liClasses}
          style={{  fontWeight: "500",color:'rgba(0,0,0,.5)' }}
            href="/student/events"
          >
            events
          </a>
          :
           <a
          className={liClasses}
          style={{  fontWeight: "500",color:'rgba(0,0,0,.5)' }}
            href="/company/events"
          >
            events
          </a>
        }
          </div>
           <div>
        {localStorage.getItem("student")?
          <a
          className={liClasses}
          style={{  fontWeight: "500",color:'rgba(0,0,0,.5)' }}
            href="/student/application"
          >
            Application
          </a>
          :
          ''
        }
          </div>
          <div> 
          {localStorage.getItem("student")?
          <a
          className=
         {liClasses}
         style={{ fontWeight: "500",color:'rgba(0,0,0,.5)' }}
            href="/student/jobs"
          >
            jobs
          </a>
          :
          ''
          }
          </div>
          <div>
        {localStorage.getItem("student")?
          <a
          className={liClasses}
          style={{  fontWeight: "500",color:'rgba(0,0,0,.5)' }}
            href="/student/list"
          >
            Students
          </a>
          :
           <a
          className={liClasses}
          style={{  fontWeight: "500",color:'rgba(0,0,0,.5)' }}
            href="/company/list"
          >
            Students
          </a>
        }
          </div>

        <div>
       
          <a className={liClasses} href="/" style={{ fontWeight: "500" }} onClick={()=>{
            localStorage.getItem("student")?this.props.logoutStudent():this.props.logoutCompany()
            
          }}>
            Logout
          </a>
        </div>
        </div>
      </nav>
    );
  }
}
Navbar.contextTypes = {
  router: PropTypes.object
};
const mapStateToProps = state => {
 // console.log(state);
  return {
    authStudent: state.auth.authStudent,
    authCompany: state.auth.authCompany
  };
};
const mapDispatchToProps = dispatch => {
  return {
    logoutStudent: () => dispatch(logoutStudent()),
    logoutCompany: () => dispatch(logoutCompany())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
