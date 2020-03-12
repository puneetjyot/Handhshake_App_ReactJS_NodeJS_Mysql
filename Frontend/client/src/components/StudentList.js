import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import axios from "axios";
import api_route from "../app-config";
import "../styles/jobs.css";
import StudentBar from "./StudentBar";

class StudentList extends Component {
  state = {
    studentarr: [],
    perStudentArr: [],
    redirect: false,
    id:''
  };

  componentDidMount() {
    let config = {
      headers: {
        Authorization: `${window.localStorage.getItem("student")}`
      }
    };
    console.log("mounting in Student List------------");
    //this.setState({educationarr:this.props.educationData})
    try {
      console.log("In try bloc");
      axios
        .get(`${api_route.host}/student/profile`, config)
        .then(res => {
          this.setState({ studentarr: res.data.msgDesc });
          this.setState({ perStudentArr: res.data.msgDesc });
          //  this.setState({studentobj:res.data.msgDesc[0]})
          console.log(res.data.msgDesc);
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  }

  filterName = value => {
    let result = [];
    console.log(value);
    this.state.perStudentArr.map(i => {
      //console.log( i.company_basic_detail.company_name.indexOf(value))
      if (
        i.name.toLowerCase().indexOf(value) >= 0 ||
        i.name.indexOf(value) >= 0
      ) {
        result.push(i);
      }
    });
    this.setState({ studentarr: result });
  };
  filterMajor = value => {
    let result = [];
    console.log(value);
    this.state.perStudentArr.map(i => {
      //console.log( i.company_basic_detail.company_name.indexOf(value))
      if (
        i.major.toLowerCase().indexOf(value) >= 0 ||
        i.major.indexOf(value) >= 0
      ) {
        result.push(i);
      }
    });
    this.setState({ studentarr: result });
  };
  filterCollege = value => {
    let result = [];
    console.log(value);
    this.state.perStudentArr.map(i => {
      //console.log( i.company_basic_detail.company_name.indexOf(value))
      if (
        i.college.toLowerCase().indexOf(value) >= 0 ||
        i.college.indexOf(value) >= 0
      ) {
        result.push(i);
      }
    });
    this.setState({ studentarr: result });
  };

  

  filterSkill = value => {
    let result = [];
    console.log(value);
    this.state.perStudentArr.map(i => {
      if(null!=i.skill_name){
        
      
      //console.log( i.company_basic_detail.company_name.indexOf(value))
      if (
        i.skill_name.toLowerCase().indexOf(value) >= 0 ||
        i.skill_name.indexOf(value) >= 0
      ) {
        result.push(i);
      }
    }
    });
    this.setState({ studentarr: result });
  };
  
  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };
  renderRedirect = () => {
      console.log("in redirecting")
    if (this.state.redirect) {
        localStorage.setItem('visitedstudent',this.state.id)
      return <Redirect to={`/student/profile/${this.state.id}`} />;
    }
  };
  render() {
    return (
       
      <div className="main-div">
       {this.renderRedirect()}
        <div className="style__secondary-nav___3_H_G pb-2 mb-3" align="center">
          <h2 className="ml-5" style={{ fontSize: "20px", fontWeight: "600" }}>
            Student List
          </h2>
        </div>
        <div className="container mt-3">
          <div className="row">
            <div className="col-3">
              <div className="card">
                <div
                  className="style__card-item___B1f7m:first-child"
                  style={{ padding: "16px" }}
                >
                  <h3 style={{ fontSize: "20px", fontWeight: "700" }}>
                    Filters
                  </h3>
                </div>
                <div className="style__divider___1j_Fp"></div>
                <div
                  className="style__card-item___B1f7m:first-child"
                  style={{ padding: "16px" }}
                >
                  <h3 style={{ fontSize: "16px", fontWeight: "500" }}>
                    {" "}
                    Name{" "}
                  </h3>
                </div>
                <div
                  style={{
                    paddingBottom: "16px",
                    paddingLeft: "16px",
                    paddingRight: "16px"
                  }}
                >
                  <input
                    className="form-control"
                    type="text"
                    placeholder="enter a name..."
                    onChange={e => {
                      this.filterName(e.target.value);
                    }}
                  ></input>
                </div>
                <div className="style__divider___1j_Fp"></div>
                <div
                  className="style__card-item___B1f7m:first-child"
                  style={{ padding: "16px" }}
                >
                  <h3 style={{ fontSize: "16px", fontWeight: "500" }}>
                    {" "}
                    Major{" "}
                  </h3>
                </div>
                <div
                  style={{
                    paddingBottom: "16px",
                    paddingLeft: "16px",
                    paddingRight: "16px"
                  }}
                >
                  <input
                    className="form-control"
                    type="text"
                    placeholder="enter a major..."
                    onChange={e => {
                      this.filterMajor(e.target.value);
                    }}
                  ></input>
                </div>
                <div className="style__divider___1j_Fp"></div>
                <div
                  className="style__card-item___B1f7m:first-child"
                  style={{ padding: "16px" }}
                >
                  <h3 style={{ fontSize: "16px", fontWeight: "500" }}>
                    {" "}
                    College Name{" "}
                  </h3>
                </div>
                <div
                  style={{
                    paddingBottom: "16px",
                    paddingLeft: "16px",
                    paddingRight: "16px"
                  }}
                >
                  <input
                    className="form-control"
                    type="text"
                    placeholder="enter college name..."
                    onChange={e => {
                      this.filterCollege(e.target.value);
                    }}
                  ></input>
                </div>


                <div className="style__divider___1j_Fp"></div>
                <div
                  className="style__card-item___B1f7m:first-child"
                  style={{ padding: "16px" }}
                >
                  <h3 style={{ fontSize: "16px", fontWeight: "500" }}>
                    {" "}
                    Skills{" "}
                  </h3>
                </div>
                <div
                  style={{
                    paddingBottom: "16px",
                    paddingLeft: "16px",
                    paddingRight: "16px"
                  }}
                >
                  <input
                    className="form-control"
                    type="text"
                    placeholder="enter a skill..."
                    onChange={e => {
                      this.filterSkill(e.target.value);
                    }}
                  ></input>
                </div>
              </div>
            </div>
            <div className="col-9">
              <div className="card" style={{ height: "500px" }}>
                <div className="style__jobs___3seWY">
                  <div className="style__card-item___B1f7m:last-child"></div>
                  <div className="style__media-body___1_M6P">
                    {this.state.perStudentArr
                      ? this.state.studentarr.map(i => (
                          <div>
                            <div className="p-2">
                              <div class="card mt-4">
                                <div
                                  className="m-3"
                                  style={{
                                    textDecoration: "underline",
                                    cursor: "pointer"
                                  }}
                                  onClick={e=>{this.setRedirect(i.student_basic_detail_id)
                                  this.setState({id:i.student_basic_detail_id})
                                  }}
                                >
                                  <h3
                                    className="ml-5"
                                    style={{
                                      fontSize: "20px",
                                      fontWeight: "600"
                                    }}
                                  >
                                    {" "}
                                    {i ? i.name : ""}
                                  </h3>
                                 
                                  <h3
                                    className="ml-5"
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "400"
                                    }}
                                  >
                                    {" "}
                                    {i ? i.college : ""}
                                  </h3>
                                  <div  className="ml-5">
                                      {i.skill_name?i.skill_name:''}
                                      </div>
                                  <div className="d-flex justify-content-between">
                                    <h3
                                      className="ml-5"
                                      style={{
                                        fontSize: "16px",
                                        fontWeight: "400",
                                        color: "rgba(0,0,0,.8)"
                                      }}
                                    >
                                      {" "}
                                      {i.education_level ? i.education_level + "," : ""}
                                      {i.major ? i.major : ""}
                                      
                                    </h3>
                                   
                                   {i.end_time? <h3
                                      className="mr-5"
                                      style={{
                                        fontSize: "16px",
                                        fontWeight: "400",
                                        color: "rgba(0,0,0,.8)"
                                      }}
                                    >
                                      Graduate On {i.end_time ? i.end_time : ""}
                                    </h3>
                                  :''}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StudentList;
