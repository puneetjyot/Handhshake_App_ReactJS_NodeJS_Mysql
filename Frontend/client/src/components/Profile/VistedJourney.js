import React, { Component } from "react";
import '../../styles/journey.css'
import axios from "axios";
import api_route from '../../app-config'
class VisitedJourney extends Component {
 constructor(props){
   super(props);
  this.state = {
    saveflag:false,
    value:'',
    journeyvalue:''
  };
}
componentDidMount(){
  console.log("in journey mount before api call")
  let config = {
      
    headers: {
      Authorization: `${window.localStorage.getItem("student")}`,
    }
  }
  axios.get(`${api_route.host}/student/profile/journey/${window.localStorage.getItem('visitedstudent')}`,config)
  .then((res)=>{
    console.log("getting journey")
    console.log(res.data.result)
  this.setState({journeyvalue:res.data.result})
  })
  .catch((err)=>
  {
    console.log(err)
  })
}
  handleSubmit=()=>{
    let config = {
      
      headers: {
        Authorization: `${window.localStorage.getItem("student")}`,
      }
    }
    let data={
      student:{
        career_objective:this.state.value
      }
   
  }
    axios.post(`${api_route.host}/student/journey`,data,config)
    .then((res)=>{
      this.setState({journeyvalue:this.state.value})
    })
    .catch((err)=>
    {
      console.log(err)
    })
  }
  
  render() {

    

    const show = (this.state.saveflag) ? "show" : "" ;
    return (
      <div className="container mt-3 p-2 pb-5">
        <div className="card jshadow">
          <div className="card-body">
            <h4 className="card-title" style={{fontSize:"18px",fontWeight:"500"}}>My Journey</h4>
            <h6 className="card-subtitle mt-1 mb-2 text-muted"></h6>
            <p className="card-text" style={{color:'#1569e0',fontSize:'14px'}}>
            What are you passionate about? What are you looking for on Handshake? What are your experiences or skills?
            </p>
            <p className="card-text" style={{fontSize:'14px'}}>
            {this.state.journeyvalue}
            </p>
            {/* <textarea name="bio" placeholder="Type your introduction..." rows="4" type="textarea" id="journey-field" className="form-control"  onClick={e=>{
              this.setState({saveflag:true}
              )
            }} onChange={e=>{
              this.setState({value:e.target.value})
            }}></textarea> */}
           <div align='right' id="save" className={"collapse navbar-collapse " + show} style={{marginTop:"20px"}}>
            <button className="btn btn-primary" onClick={
              this.handleSubmit
            }>Save</button>
           </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VisitedJourney;
