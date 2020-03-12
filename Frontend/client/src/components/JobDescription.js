import React, { Component } from 'react';
import '../styles/jobs.css';
import api_route from "../app-config";
import { Redirect } from "react-router-dom";

import axios from "axios";
class JobDescription extends Component {
    state = {  

        modalShow:"none",
        selectedFile: null,
        jobId:'',
        applyerror:'',
        selectedjobId:'',
        resumeShow:''
    }

    onResumeSubmit= (e)=>
    {
      e.preventDefault();
        console.log(this.state.selectedjobId);
        
        const data = new FormData()
        console.log(this.state.selectedFile)
     data.append('myimage', this.state.selectedFile)
    
      let config = {
      
      headers: {
        Authorization: `${window.localStorage.getItem("student")}`,
      }
    }
    
   console.log(data)
  
    axios.post(`${api_route.host}/student/upload/${this.state.selectedjobId}`,data,config)
    .then((res)=>{

     console.log(res)
     var path=`${api_route.host}//${res.data.resume}`
     this.setState({resumeShow:path})
    })
    .catch((err)=>
    {
        this.setState({applyerror:'UniqueError'})
      console.log(err)
    })
  }

  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };
  renderRedirect = () => {
      console.log("in redirecting")
    if (this.state.redirect) {
        localStorage.setItem('visitedcompany',this.state.id)
      return <Redirect to={`/visitcompany/home/${localStorage.getItem('visitedcompany')}`} />;
    }
  };
    
    render() { 
        console.log(this.props.jobdata)
        return ( 
            <div>
             {this.renderRedirect()}
            <div className='p-2 ml-3 b-1'> 
            <p style={{fontSize:'24px',fontWeight:'700' ,fontFamily: "Suisse Int",marginBottom: "5px"}}>{this.props.jobdata.job_category}</p>
            <div style={{textDecoration:'underline',cursor:"pointer"}}  onClick={e=>{this.setRedirect(this.props.jobdata.company_basic_detail.company_basic_detail_id)
                                  this.setState({id:this.props.jobdata.company_basic_detail.company_basic_detail_id})
                                  }}>
             <p style={{fontSize:'18px',fontWeight:'500' ,fontFamily: "Suisse Int",color:'rgba(0,0,0,.56)'}}>{this.props.jobdata.company_basic_detail?this.props.jobdata.company_basic_detail.company_name:''}</p>
             </div>
            </div>
            <div className='d-flex ml-3'>
            <div className='d-flex '>
            <ion-icon name="briefcase"></ion-icon>
            <p style={{color: "rgba(0,0,0,.56)",fontSize:'14px' , }} className='ml-2'>{this.props.jobdata.job_category} Job,</p>
            </div>
            <div className='d-flex ml-2'>
             <ion-icon name="location"></ion-icon>
            <p style={{color: "rgba(0,0,0,.56)",fontSize:'14px' , }} className='ml-2'>{this.props.jobdata.location},</p>
            </div>
            <div className='d-flex ml-2'>
             <ion-icon name="cash-outline"></ion-icon>
            <p style={{color: "rgba(0,0,0,.56)",fontSize:'14px' , }} className='ml-2'>${this.props.jobdata.salary} per year</p>
            </div>
            </div>

            <div className='style__card___31yrn m-2'>
            <div className='d-flex justify-content-between' style={{fontSize:"20px",fontWeight:'600',alignSelf: "center"}}>
            <p> Application closes on {this.props.jobdata.deadline}</p>
            <button id="myBtn" className='btn btn-outline-success' style={{fontSize:"13px"}} onClick={e=>{
                this.setState({modalShow:'block'})
            }}>Apply</button>
            <div id="myModal" className="modal" style={{display:this.state.modalShow}} >


 
            <div className= "modal-content col-5" style={{fontFamily: "Suisse"}}>
            <div className='container'>
            {this.state.applyerror?<p style={{color:'red'}}>Job Already applied</p>:''}
                <span class="close" onClick={e=>{
                    this.setState({modalShow:'none'})
                    this.setState({applyerror:''})
                }}>&times;</span>
                <p style={{fontSize:'18px',fontWeight:'700'}}>Apply to {this.props.jobdata.company_basic_detail?this.props.jobdata.company_basic_detail.company_name:''}</p>
                 <p style={{fontSize:'15px',fontWeight:'500'}}>Details from {this.props.jobdata.company_basic_detail?this.props.jobdata.company_basic_detail.company_name:''}:</p>
                 <p style={{fontSize:'15px',fontWeight:'200',color:'rgba(0,0,0,0.8)'}} >Applying for {this.props.jobdata.job_title} requires a few documents. Attach them below and get one step closer to your next job!</p>
                <h4> Attach your Resume!</h4>
                <div>
                
                <label style={{fontSize:'15px',fontWeight:'500'}} for="img">Your Resume:</label>
                <form onSubmit={this.onResumeSubmit} enctype="multipart/form-data">
                <input style={{fontSize:'13px'}}  type="file" name="file" id="file" onChange={event=>{
                  console.log(event.target.files[0])
                   this.setState({selectedFile: event.target.files[0]}) 
                 } }/>
                 {this.state.resumeShow?<a href={this.state.resumeShow} download="Resume">Download</a>:''}

                <div>
                <button className='form-control mt-2 btn btn-outline-success' onClick={(e)=>{
                     this.setState({selectedjobId:this.props.jobdata.job_id}) 
                } } >Submit</button>
                </div>
                </form>
                </div>
                </div>


            </div>

            </div>

            </div>
            </div>
            <div className='style__card___31yrn m-2'>
            <h4 className='mb-3'>Description about the job</h4>
            <p style={{color: "dodgerblue"}}>{this.props.jobdata.job_description}</p> </div>

            </div>
         );
    }
}
 
export default JobDescription;