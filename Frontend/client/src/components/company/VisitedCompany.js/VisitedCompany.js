import React, { Component } from "react";
import api_route from "../../../app-config";
import axios from "axios";
import "../../../styles/companyprofilepic.css";
import "../../../styles/company.css";
import { Redirect } from "react-router-dom";

class VisitedCompany extends Component {
  state = {
    companyobj: "",
    showInfo: "block",
    editInfo: "none",
    name: "",
    phone: "",
    location: "",
    jobarr: [],
    jobobj: "",
    perjobarr: [],
    modalShow: "none",
    jobtitle: "",
    value: "Full-Time",
    job_category: "Full-Time",
    joblocation: "",
    salary: "",
    deadline: "",
    jobdescription: "",
    addSuccessMsg: "",
    id: "",
    propicture:''
  };
  componentDidMount() {
    let config = {
      headers: {
        Authorization: `${window.localStorage.getItem("company")}`
      }
    };
    console.log("mounting in education------------");
    //this.setState({educationarr:this.props.educationData})
    try {
      console.log("In try bloc");
      axios
        .get(`${api_route.host}/company/${localStorage.getItem('visitedcompany')}`, config)
        .then(res => {
          this.setState({ companyobj: res.data.company });
          console.log(res.data.company);
          if(res.data.company.company_profile.profilepicaddress){
            var src=`${api_route.host}//${res.data.company.company_profile.profilepicaddress}`
            this.setState({propicture:src})
            }
          try {
            console.log("In try bloc");
            axios
              .get(`${api_route.host}/jobs/`, config)
              .then(res => {
                this.setState({ jobarr: res.data.result });
                this.setState({ perjobarr: res.data.result });
                this.setState({ jobobj: res.data.result[0] });
                console.log(this.state.companyobj);
                const result = this.state.perjobarr.filter(
                  i =>
                    i.company_basic_detail.company_basic_detail_id ==
                    this.state.companyobj.company_basic_details
                      .company_basic_detail_id
                );
                console.log(result);
                this.setState({ jobarr: result });
              })
              .catch(err => {
                console.log(err);
              });
          } catch (err) {
            console.log(err);
          }
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
    console.log("getting education in mount");
  //  this.props.getEducation();
   
    
  }
  filterByTitleOrCompany = value => {
    let result = [];
    console.log(value);
    this.state.perjobarr.map(i => {
      console.log(i.company_basic_detail.company_name.indexOf(value));
      if (
        i.job_title.toLowerCase().indexOf(value) >= 0 ||
        i.company_basic_detail.company_name.toLowerCase().indexOf(value) >= 0 ||
        i.job_title.indexOf(value) >= 0 ||
        i.company_basic_detail.company_name.indexOf(value) >= 0
      ) {
        result.push(i);
      }
    });
    this.setState({ jobarr: result });
  };

  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };
  renderRedirect = () => {
    console.log("in redirecting");
    if (this.state.redirect) {
      localStorage.setItem("jobid", this.state.id);
      return <Redirect to={`/job/student/${this.state.id}`} />;
    }
  };

  filterByLocation = value => {
    let result = [];
    console.log(value);
    this.state.perjobarr.map(i => {
      //console.log( i.company_basic_detail.company_name.indexOf(value))
      if (
        i.location.toLowerCase().indexOf(value) >= 0 ||
        i.location.indexOf(value) >= 0
      ) {
        result.push(i);
      }
    });
    this.setState({ jobarr: result });
  };

  handleSubmit = e => {
    e.preventDefault();
    let config = {
      headers: {
        Authorization: `${window.localStorage.getItem("company")}`
      }
    };
    let data = {
      job: {
        job_title: this.state.jobtitle,
        deadline: this.state.deadline,
        location: this.state.joblocation,
        salary: this.state.salary,
        job_description: this.state.jobdescription,
        job_category: this.state.job_category
      }
    };
    axios
      .post(`${api_route.host}/jobs/`, data, config)
      .then(res => {
        this.setState({ addSuccessMsg: "Job added Successfully" });
        let newarr = this.state.perjobarr;
        newarr.push(res.data);
        console.log(newarr);

        this.setState({ jobarr: newarr });
        this.setState({ perjobarr: newarr });
      })
      .catch(err => {
        console.log(err);
      });
  };

  editCompanyInfo = e => {
    //console.log(this.state.schoolname+" "+editid)

    let config = {
      headers: {
        Authorization: `${window.localStorage.getItem("company")}`
      }
    };
    let data = {
      company: {
        location: this.state.location ? this.state.location : "",
        phone: this.state.phone ? this.state.phone : "",
        name: this.state.name ? this.state.name : ""
      }
    };
    axios
      .put(`${api_route.host}/company/`, data, config)
      .then(res => {
        console.log("response coming");
        // let newarr = this.state.educationarr;
        // newarr.push(res.data);
        console.log(res.data);
        this.setState({ companyobj: res.data.company });
      })
      .catch(err => {
        console.log(err);
      });
  };

  updatePic=(e)=>{
    e.preventDefault();
    console.log("pro pic change")
    console.log(this.state.picture)
    let picdata=new FormData();
    picdata.append('myimage',this.state.picture)
    let config = {
          headers: {
            Authorization: `${window.localStorage.getItem("company")}`
          }
        };
       
        console.log("mounting in picture------------");
        try {
          console.log("In try block");
          axios
            .post(`${api_route.host}/company/picture`,picdata, config)
            .then(res => {
              console.log(res.data);
              var src=`${api_route.host}//${res.data.name}`
             this.setState({ propicture: src });
            })
            .catch(err => {
              console.log(err);
            });
        } catch (err) {
          console.log(err);
        }
     
  }

  render() {
    return (
      <div>
        {this.renderRedirect()}
        <div className="container d-flex mt-3 p-2 pb-5">
          <div className="col-3">
            <div className="card mt-3">
              <div className="card-title p-2" align="center">
                <div>
                  <div align="center" className="mt-2">
                    {console.log(api_route.host / this.state.propicture)}
                    {this.state.propicture ? (
                      <div className="style__edit-photo___B-_os">
                        <img src={this.state.propicture} />
                      </div>
                    ) : (
                      <form onSubmit={this.updatePic}>
                        <div>
                          <button className="style__edit-photo___B-_os">
                            <div>
                              <ion-icon
                                size="large"
                                name="camera"
                                style={{ color: "#1569e0" }}
                              ></ion-icon>
                            </div>

                            <div>
                              {" "}
                              <input
                                style={{ color: "#1569e0", fontSize: "13px" }}
                                type="file"
                                name="file"
                                onChange={e => {
                                  console.log(e.target.files[0]);
                                  this.setState({ picture: e.target.files[0] });
                                }}
                              ></input>
                            </div>
                          </button>
                        </div>

                        <input
                          style={{ fontSize: "10px" }}
                          type="submit"
                          className="btn btn-primary mt-3"
                          value="Edit Pic"
                        ></input>
                      </form>
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <h3 style={{ fontSize: "20px", fontWeight: "600" }}>
                    {this.state.companyobj.company_basic_details
                      ? this.state.companyobj.company_basic_details.company_name
                      : ""}
                  </h3>
                </div>
              </div>
              <div
                style={{ display: this.state.showInfo }}
                align="center"
                className="ml-4"
              >
                {" "}
                <div className="d-flex">
                  <div className="d-flex ml-3">
                    <ion-icon name="location"></ion-icon>
                    <p
                      style={{ color: "rgba(0,0,0,.56)", fontSize: "14px" }}
                      className="ml-2"
                    >
                      {this.state.companyobj.company_basic_details
                        ? this.state.companyobj.company_basic_details.location
                        : ""}
                    </p>
                  </div>
                  <div className="d-flex ml-3">
                    <ion-icon name="call"></ion-icon>
                    <p
                      style={{ color: "rgba(0,0,0,.56)", fontSize: "14px" }}
                      className="ml-2"
                    >
                      {this.state.companyobj.company_profile
                        ? this.state.companyobj.company_profile.phone
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="mr-3">
                  <p style={{ color: "rgba(0,0,0,.56)", fontSize: "14px" }}>
                    {" "}
                    email:{" "}
                    {this.state.companyobj.company_basic_details
                      ? this.state.companyobj.company_basic_details.emailId
                      : ""}
                  </p>
                </div>
                <p className="card-text" style={{ fontSize: "14px" }}>
                  {this.state.companyobj.company_profile
                    ? this.state.companyobj.company_profile.description
                    : ""}
                </p>
              </div>
              <div
                style={{ display: this.state.editInfo }}
                align="center"
                className="ml-4"
              >
                <table>
                  <tr>
                    <td>Name</td>
                    <td>
                      <div className="col-11">
                        <input
                          type="text"
                          className="form-control"
                          placeholder={
                            this.state.companyobj.company_basic_details
                              ? this.state.companyobj.company_basic_details
                                  .company_name
                              : ""
                          }
                          onChange={e => {
                            this.setState({ name: e.target.value });
                          }}
                        ></input>
                      </div>
                    </td>
                  </tr>

                  <div className="mt-1"></div>
                  <tr>
                    <td>Phone</td>
                    <td>
                      <div className="col-11">
                        <input
                          type="text"
                          className="form-control"
                          placeholder={
                            this.state.companyobj.company_profile
                              ? this.state.companyobj.company_profile.phone
                              : ""
                          }
                          onChange={e => {
                            this.setState({ phone: e.target.value });
                          }}
                        ></input>
                      </div>
                    </td>
                  </tr>
                  <div className="mt-1"></div>
                  <tr>
                    <td>Location</td>
                    <td>
                      <div className="col-11">
                        <input
                          type="text"
                          className="form-control"
                          placeholder={
                            this.state.companyobj.company_basic_details
                              ? this.state.companyobj.company_basic_details
                                  .location
                              : ""
                          }
                          onChange={e => {
                            this.setState({ location: e.target.value });
                          }}
                        ></input>
                      </div>
                    </td>
                  </tr>
                </table>
                <div
                  style={{ display: this.state.editInfo }}
                  className="col-7 ml-2 mt-2"
                >
                  <button
                    className="btn btn-primary m-2"
                    onClick={e => {
                      this.setState({ editInfo: "none", showInfo: "block" });
                      this.editCompanyInfo();
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
              {/* <div className="p-2">
                <p>
                  {this.state.companyobj
                    ? this.state.companyobj.company_profile.description
                    : ""}
                </p>
              </div> */}
              <div
                style={{ display: this.state.showInfo }}
                className="col-7 ml-5 mt-2"
                align="center"
              >
                {/* <button
                  className="btn btn-primary m-2"
                  onClick={e => {
                    this.setState({ editInfo: "block", showInfo: "none" });
                  }}
                >
                  Edit
                </button> */}
              </div>
            </div>
            <div className="container mt-3 p-2 pb-5"></div>
          </div>
          <div className="col-8">
            <div className="card">
              <div className="card-body d-flex justify-content-between">
                <div className="d-flex col-6">
                  <div
                    className="m-2"
                    style={{ left: "40px", position: "relative" }}
                  >
                    <ion-icon name="search"></ion-icon>
                  </div>
                  <input
                    type="text"
                    className="form-control p-2 pl-5"
                    placeholder="Job titles or keywords"
                    onChange={e => {
                      this.filterByTitleOrCompany(e.target.value);
                    }}
                  />
                </div>
                <div className="d-flex col-6">
                  <div
                    className="m-2"
                    style={{ left: "40px", position: "relative" }}
                  >
                    <ion-icon name="location"></ion-icon>
                  </div>
                  <input
                    type="text"
                    className="form-control p-2 pl-5"
                    placeholder="City, State, Zip Code, or Address"
                    onChange={e => {
                      this.filterByLocation(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <div className="d-flex p-2 ml-2">
                  <button
                    className="style__pill___3uHDM"
                    onClick={e => {
                      const result = this.state.perjobarr.filter(
                        i => i.job_category == "Full-Time"
                      );
                      this.setState({ jobarr: result });
                    }}
                  >
                    Full-Time Job
                  </button>
                  <button
                    className="style__pill___3uHDM"
                    onClick={e => {
                      const result = this.state.perjobarr.filter(
                        i => i.job_category == "Part-Time"
                      );
                      this.setState({ jobarr: result });
                    }}
                  >
                    Part-Time
                  </button>
                  <button
                    className="style__pill___3uHDM"
                    onClick={e => {
                      const result = this.state.perjobarr.filter(
                        i => i.job_category == "Internship"
                      );
                      this.setState({ jobarr: result });
                    }}
                  >
                    Internship
                  </button>
                  <button
                    className="style__pill___3uHDM"
                    onClick={e => {
                      const result = this.state.perjobarr.filter(
                        i => i.job_category == "On-Campus"
                      );
                      this.setState({ jobarr: result });
                    }}
                  >
                    On-Campus
                  </button>
                </div>
                <div className="p-2 ml-2">
                  {/* <button
                    className="style__pill___3uHDM"
                    onClick={e => {
                      this.setState({ modalShow: "block" });
                    }}
                  >
                    <ion-icon name="add"></ion-icon>
                    Add Jobs
                  </button> */}
                </div>
                <div
                  id="myModal"
                  className="modal"
                  style={{ display: this.state.modalShow }}
                >
                  <div
                    className="modal-content col-5"
                    style={{ fontFamily: "Suisse" }}
                  >
                    <div className="container">
                      <span
                        class="close"
                        onClick={e => {
                          this.setState({ modalShow: "none" });
                        }}
                      >
                        &times;
                      </span>
                      {this.state.addSuccessMsg ? (
                        <p style={{ color: "green" }}>
                          {this.state.addSuccessMsg}
                        </p>
                      ) : (
                        ""
                      )}
                      <div align="center">
                        <h3 style={{ fontWeight: "bold", marginBottom: "5px" }}>
                          New Job
                        </h3>
                      </div>
                      <form onSubmit={this.handleSubmit}>
                        <div className="form-group col-md-11">
                          <label
                            style={{ fontWeight: "bold", marginBottom: "5px" }}
                          >
                            Job Title
                          </label>
                          <input
                            type="text"
                            id="jobtitle"
                            name="jobtitle"
                            className="form-control"
                            placeholder="Enter Job Title"
                            onChange={e => {
                              this.setState({ jobtitle: e.target.value });
                            }}
                            required
                          ></input>
                        </div>
                        <div className="form-group col-md-11">
                          <label
                            style={{ fontWeight: "bold", marginBottom: "5px" }}
                          >
                            Category
                          </label>
                          <select
                            value={this.state.job_category}
                            id="category"
                            className="form-control"
                            onChange={e => {
                              this.setState({ job_category: e.target.value });
                            }}
                            required
                          >
                            <option value="Full-Time">Full Time</option>
                            <option value="Part-Time">Part Time</option>
                            <option value="On-Campus">On Campus</option>
                            <option value="Internship">Internship</option>
                          </select>
                        </div>
                        <div className="form-group col-md-11">
                          <div>
                            <label
                              style={{
                                fontWeight: "bold",
                                marginBottom: "5px"
                              }}
                            >
                              Location
                            </label>
                          </div>

                          <label
                            style={{
                              fontWeight: "500",
                              fontSize: "13px",
                              marginBottom: "5px"
                            }}
                          >
                            Please enter location
                          </label>
                          <input
                            type="text"
                            id="joblocation"
                            name="joblocation"
                            className="form-control"
                            placeholder="Eg. New York"
                            onChange={e => {
                              this.setState({ joblocation: e.target.value });
                            }}
                            required
                          ></input>
                        </div>
                        <div className="col-md-11 d-flex p-0">
                          <div className="form-group col-md-6 ">
                            <label
                              style={{
                                fontWeight: "bold",
                                marginBottom: "5px"
                              }}
                            >
                              Salary
                            </label>
                            <input
                              type="number"
                              id="salary"
                              name="salary"
                              className="form-control"
                              placeholder="Eg. 500000"
                              onChange={e => {
                                this.setState({ salary: e.target.value });
                              }}
                              required
                            ></input>
                          </div>
                          <div className="form-group col-md-6">
                            <label
                              style={{
                                fontWeight: "bold",
                                marginBottom: "5px"
                              }}
                            >
                              Deadline
                            </label>
                            <input
                              type="date"
                              id="deadline"
                              name="deadline"
                              className="form-control"
                              placeholder="Deadline"
                              onChange={e => {
                                this.setState({
                                  deadline: e.target.value
                                });
                              }}
                              required
                            ></input>
                          </div>
                        </div>
                        <div className="form-group col-md-11">
                          <label
                            style={{ fontWeight: "bold", marginBottom: "5px" }}
                          >
                            Description
                          </label>
                          <textarea
                            id="jobdescription"
                            name="jobdescription"
                            className="form-control"
                            placeholder="Enter Job Description"
                            onChange={e => {
                              this.setState({ jobdescription: e.target.value });
                            }}
                            required
                          ></textarea>
                        </div>
                        <div className="form-group col-md-8 m-3">
                          <input
                            type="submit"
                            className="btn btn btn-primary"
                          ></input>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="style__jobs___3seWY" style={{ height: "500px" }}>
                {this.state.jobarr
                  ? this.state.jobarr.map(i => (
                      <div key={i.job_id}>
                        <div
                          className="style__selected___1DMZ3 p-2 mt-3 m-1 card"
                        //   onClick={e => {
                        //     this.setRedirect(i.job_id);
                        //     this.setState({ id: i.job_id });
                        //   }}
                        >
                          <div className="d-flex">
                            <ion-icon name="briefcase"></ion-icon>
                            <h3
                              className="ml-2"
                              style={{ fontSize: "16px", fontWeight: "700" }}
                            >
                              {i.job_title}
                            </h3>
                          </div>
                          <h3 style={{ fontSize: "16px", fontWeight: "400" }}>
                            {i.company_basic_detail
                              ? i.company_basic_detail.company_name
                              : ""}
                          </h3>
                          <h3
                            style={{
                              color: "rgba(0,0,0,.56)",
                              fontWeight: "200px",
                              fontSize: "14px"
                            }}
                          >
                            {i.job_category} Job
                          </h3>
                        </div>
                      </div>
                    ))
                  : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VisitedCompany;
