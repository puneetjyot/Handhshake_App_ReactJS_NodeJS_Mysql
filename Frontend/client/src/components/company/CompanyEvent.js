import React, { Component } from "react";
import api_route from "../../app-config";
import axios from "axios";
import "../../styles/profilepic.css";
import "../../styles/company.css";
import { Redirect } from "react-router-dom";

class CompanyHome extends Component {
  state = {
    companyobj: "",
    showInfo: "block",
    editInfo: "none",
  
   
    jobarr: [],
    jobobj: "",
    perjobarr: [],
    modalShow: "none",
    eventtitle: "",
    value: 'All',
    addSuccessMsg:'',
    id:'',
    date:'',
    location:'',
    event_time: '',
    event_description:'',
    eligibility: ''
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
        .get(`${api_route.host}/company/`, config)
        .then(res => {
          this.setState({ companyobj: res.data.company });
          console.log(res.data);
          try {
            console.log("In try bloc");
            axios
              .get(`${api_route.host}/events/`, config)
              .then(res => {

                this.setState({ jobarr: res.data.result });
                this.setState({ perjobarr: res.data.result });
                this.setState({ jobobj: res.data.result[0] });
                 console.log(this.state.jobobj)
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

    
  }
  filterByTitleOrCompany = value => {
    let result = [];
    console.log(value);
    this.state.perjobarr.map(i => {
      console.log(i.company_basic_detail.company_name.indexOf(value));
      if (
        i.event_name.toLowerCase().indexOf(value) >= 0 ||
        i.company_basic_detail.company_name.toLowerCase().indexOf(value) >= 0 ||
        i.event_name.indexOf(value) >= 0 ||
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
      console.log("in redirecting")
    if (this.state.redirect) {
        localStorage.setItem('eventId',this.state.id)
      return <Redirect to={`/event/student/${this.state.id}`} />;
    }
  };

  

  filterByLocation = value => {
    let result = [];
    console.log(this.state.perjobarr);
    this.state.perjobarr.map(i => {
      //console.log( i.company_basic_detail.company_name.indexOf(value))
      if (
         
        // i.location.toLowerCase().indexOf(value) >= 0 ||
        i.location.indexOf(value) >= 0
      ) {
        console.log(i.location)
        result.push(i);
      }
    });
    this.setState({ jobarr: result });
  };

  handleSubmit= e =>{
      e.preventDefault();
    let config = {
        headers: {
          Authorization: `${window.localStorage.getItem("company")}`
        }
      };
      let data = {
        event: {
          event_name: this.state.eventtitle,
          date: this.state.date,
          location: this.state.eventlocation,
          event_time: this.state.event_time,
          event_description: this.state.event_description,
          eligibility: this.state.eligibility,
         
        }
      };
      axios
        .post(`${api_route.host}/events/`, data, config)
        .then(res => {
            this.setState({addSuccessMsg:'event added Successfully'})
          let newarr = this.state.perjobarr;
          newarr.push(res.data);
          console.log(newarr);
          
          this.setState({ jobarr: newarr });
          this.setState({ perjobarr: newarr });
          const result = this.state.perjobarr.filter(
            i =>
              i.company_basic_detail.company_basic_detail_id ==
              this.state.companyobj.company_basic_details
                .company_basic_detail_id
          );
        })
        .catch(err => {
          console.log(err);
        });
  }

 
  render() {
    return (
      <div align='center'>
        {this.renderRedirect()}
        <div className='maindiv '>
           <div className='style__secondary-nav___3_H_G pb-2 mb-3' align='center'>
            <h2 className='ml-5' style={{fontSize:'20px',fontWeight:'600'}}>Event Search</h2>
            </div>
            </div>
            
          <div align='center'>
          <div className="col-8" >
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
               <div></div>
                <div className="p-2 ml-2 mr-4">
                  <button
                    className="btn btn-info"
                    onClick={e => {
                      this.setState({ modalShow: "block" });
                    }}
                  >
                    <ion-icon name="add"></ion-icon>
                    Add Events
                  </button>
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
                      {this.state.addSuccessMsg?<p style={{color:'green'}}>{this.state.addSuccessMsg}</p>:''}
                      <div align='center'>
                        <h3 style={{ fontWeight: "bold", marginBottom: "5px" }}>New Event</h3>
                      </div>
                      <form onSubmit={this.handleSubmit}>
                        <div className="form-group col-md-11">
                          <label
                            style={{ fontWeight: "bold", marginBottom: "5px" }}
                          >
                            Event Title
                          </label>
                          <input
                            type="text"
                            id="eventtitle"
                            name="eventtitle"
                            className="form-control"
                            placeholder="Enter Job Title"
                            onChange={e => {
                              this.setState({ eventtitle: e.target.value });
                            }}
                            required
                          ></input>
                        </div>
                        <div className="form-group col-md-11">
                          <label
                            style={{ fontWeight: "bold", marginBottom: "5px" }}
                          >
                            
                          </label>
                          <select
                            value={this.state.eligibility}
                            id="category"
                            className='form-control'
                            onChange={e => {
                              this.setState({ eligibility: e.target.value });
                            }}
                            required
                          >
                              <option value='All'>All</option>
                              <option value='CSE'>Computer Science</option>
                              <option value='Se'>Software Engineer</option>
                              <option value='EM'>Engineering Management</option>
                              <option value='IE'>Industrial Engineering</option>
                          </select>
                        </div>
                        <div className="form-group col-md-11">
                          <div>
                            <label
                              style={{ fontWeight: "bold", marginBottom: "5px" }}
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
                              this.setState({ eventlocation: e.target.value });
                            }}
                            required
                          ></input>
                        </div>
                        <div className="col-md-11 d-flex p-0">
                          <div className="form-group col-md-6 ">
                            <label
                              style={{ fontWeight: "bold", marginBottom: "5px" }}
                            >
                              Time
                            </label>
                            <input
                              type="time"
                              id="Time"
                              name="Time"
                              className="form-control"
                              placeholder="Eg. 500000"
                              onChange={e => {
                                this.setState({ event_time: e.target.value });
                              }}
                              required
                            ></input>
                          </div>
                          <div className="form-group col-md-6">
                            <label
                              style={{ fontWeight: "bold", marginBottom: "5px" }}
                            >
                              Date
                            </label>
                            <input
                              type="date"
                              id="date"
                              name="date"
                              className="form-control"
                              placeholder="Event Date"
                              onChange={e => {
                                this.setState({
                                  date: e.target.value
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
                            
                            id="event_description"
                            name="event_description"
                            className="form-control"
                            placeholder="Enter Job Description"
                            onChange={e => {
                              this.setState({ event_description: e.target.value });
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
                      <div key={i.event_detail_id}>
                        <div
                          className="style__selected___1DMZ3 p-2 mt-3 jobdiv m-1 card"
                          onClick={e=>{this.setRedirect(i.event_detail_id)
                                  this.setState({id:i.event_detail_id})
                          }}
                        >
                          <div className="d-flex">
                            <ion-icon name="briefcase"></ion-icon>
                            <h3
                              className="ml-2"
                              style={{ fontSize: "16px", fontWeight: "700" }}
                            >
                              {i.event_name}
                            </h3>
                          </div>
                          <div align='left'>
                          <h3 style={{ fontSize: "16px", fontWeight: "400" }}>
                            {i.company_basic_detail?i.company_basic_detail.company_name:''}
                          </h3>
                          <h3
                            style={{
                              color: "rgba(0,0,0,.56)",
                              fontWeight: "200px",
                              fontSize: "14px"
                            }}
                          >
                            {i.event_time} PST time
                          </h3>
                          <h3
                            style={{
                              color: "rgba(0,0,0,.56)",
                              fontWeight: "200px",
                              fontSize: "14px"
                            }}
                          >
                            {i.location} 
                          </h3>
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
    
    );
  }
}

export default CompanyHome;
