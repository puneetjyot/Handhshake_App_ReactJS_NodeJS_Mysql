import React, { Component } from "react";
import axios from 'axios'
import api_route from '../../app-config';

class VisitedPersonalInfo extends Component {
  state = {
      showInfo:"block",
      editInfo:'none',
      email:'',
      dob:'',
      country:'',
      studentstate:'',
      city:'',
      phone:''
  };

  componentDidMount()
  {
    console.log("getting education in mount");
    //  this.props.getEducation();
      let config = {
        headers: {
          Authorization: `${window.localStorage.getItem("student")}`
        }
      };
      console.log("mounting in personal info------------");
      try {
        console.log("In try bloc");
        axios
          .get(`${api_route.host}/student/profile/${window.localStorage.getItem('visitedstudent')}`, config)
          .then(res => {
            console.log(res.data);
            this.setState({ dataarr: res.data });
          })
          .catch(err => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
  }

    submitDetails()
    {
        let config = {
            headers: {
              Authorization: `${window.localStorage.getItem("student")}`
            }
          };
          let data = {
            basicdetails: {
              email: this.state.email,
              dob: this.state.dob,
              country: this.state.country,
              city: this.state.city,
              studentstate: this.state.studentstate,
              phone: this.state.phone
            }
          };
          console.log("going to enter student data")
          axios
            .post(`${api_route.host}/student/basicdetails`, data, config)
            .then(res => {
               console.log(res.data);
            //   let newarr = this.state.experiencearr;
            //   newarr.push(res.data.experiencearr);
            //   console.log(newarr);
            //   this.setState({ experiencearr: newarr });
            this.setState({dataarr:res.data.result})
            console.log()
            })
            .catch(err => {
              console.log(err);
            });
    }
  render() {
    return (
      <div className="container mt-4">
        <div className="row">
          <div className="col-12 col-md-offset-1 shadow_style">
            <div className="card">
              <div className="m-3 d-flex justify-content-between">
                <h2 style={{ fontSize: "20px", fontWeight: "500" }}>
                  Personal Information
                </h2>
                {/* <button onClick={(e)=>{
                    this.setState({showInfo:'none',editInfo:'block'})
                }}>
                <ion-icon name="create-outline" style={{fontSize:'20px'}}></ion-icon>
                </button> */}
              </div>
              <div className='p-2'>
              <div className='d-flex justify-content-between'>
             <h4 className="mt-4 ml-2" style={{fontSize:'18px',fontWeight:'600'}}>Email Address</h4>
            <div  style={{display:this.state.showInfo}}>
             <h4 className="ml-5 mr-2 mt-4"  style={{fontSize:'16px',fontWeight:'400'}}>{this.state.dataarr?this.state.dataarr.student.email:''}</h4>
             </div>
            <input  style={{display:this.state.editInfo}} type ='text' className="form-control" placeholder={this.state.dataarr?this.state.dataarr.student.email:''} onChange={e=>{
                this.setState({email:e.target.value})
            }} required></input>
             </div>

                 <div className='d-flex justify-content-between'>
                 <h4 className="m-2" style={{fontSize:'18px',fontWeight:'600'}}>  Date Of Birth</h4>
                 <div  style={{display:this.state.showInfo}}>
                 <h4 style={{display:this.state.showInfo}} className="m-2" style={{fontSize:'16px',fontWeight:'400'}}>{this.state.dataarr?this.state.dataarr.student.student_basic_details.dob:''}</h4>
              </div>
                 <input  style={{display:this.state.editInfo}} type ='text' className="form-control" placeholder={this.state.dataarr?this.state.dataarr.student.student_basic_details.dob:''} onChange={e=>{
                this.setState({dob:e.target.value})
            }}></input>
                 </div>
                 <div className='d-flex justify-content-between'>
                 <h4 className="m-2" style={{fontSize:'18px',fontWeight:'600'}}>  Country</h4>
                 <div  style={{display:this.state.showInfo}}>
                 <h4 style={{display:this.state.showInfo}} className="m-2" style={{fontSize:'16px',fontWeight:'400'}}>{this.state.dataarr?this.state.dataarr.student.student_basic_details.country:''}</h4>
                </div>
                 <input style={{display:this.state.editInfo}} type ='text' className="form-control" placeholder={this.state.dataarr?this.state.dataarr.student.student_basic_details.country:''} onChange={e=>{
                this.setState({country:e.target.value})
            }}></input>
                 </div>
            
                 <div className='d-flex justify-content-between'>
                 <h4 className="m-2" style={{fontSize:'18px',fontWeight:'600'}}>  State</h4>
                 <div  style={{display:this.state.showInfo}}>
                 <h4 style={{display:this.state.showInfo}} className="m-2" style={{fontSize:'16px',fontWeight:'400'}}>{this.state.dataarr?this.state.dataarr.student.student_basic_details.state:''}</h4>
                </div>
                 <input style={{display:this.state.editInfo}} type ='text' className="form-control" placeholder={this.state.dataarr?this.state.dataarr.student.student_basic_details.state:''} onChange={e=>{
                this.setState({studentstate:e.target.value})
            }}></input>
                 </div>
                 <div className='d-flex justify-content-between'>
                 <h4 className="m-2" style={{fontSize:'18px',fontWeight:'600'}}>  City</h4>
                 <div  style={{display:this.state.showInfo}}>
                 <h4 style={{display:this.state.showInfo}} className="m-2 ml-5" style={{fontSize:'16px',fontWeight:'400'}}>{this.state.dataarr?this.state.dataarr.student.student_basic_details.city:''}</h4>
                </div>
                 <input style={{display:this.state.editInfo}} type ='text' className="form-control" placeholder={this.state.dataarr?this.state.dataarr.student.student_basic_details.city:''} onChange={e=>{
                this.setState({city:e.target.value})
            }}></input>
                 </div>
                 <div className='d-flex justify-content-between'>
                 <h4 className="m-2" style={{fontSize:'18px',fontWeight:'600'}}>Phone </h4>
                 <div  style={{display:this.state.showInfo}}>
                 <h4 style={{display:this.state.showInfo}} className="m-2 ml-5" style={{fontSize:'16px',fontWeight:'400'}}>{this.state.dataarr?this.state.dataarr.student.student_basic_details.phone_number:''}</h4>
                </div>
                 <input  style={{display:this.state.editInfo }} type ='text' className="form-control" placeholder={this.state.dataarr?this.state.dataarr.student.student_basic_details.phone_number:''} onChange={e=>{
                this.setState({phone:e.target.value})
            }}></input>
                 </div>
                 {/* <button className='btn btn-success m-2' align='center' style={{display:this.state.editInfo}} onClick={e=>{
                     this.setState({editInfo:'none',showInfo:'block'})
                     this.submitDetails()
                 }}> Submit</button> */}
                 
                 
            

            
             </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VisitedPersonalInfo;
