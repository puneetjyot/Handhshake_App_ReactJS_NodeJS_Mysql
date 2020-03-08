import React, { Component } from 'react';
import axios from 'axios'
import api_route from '../app-config'
import '../styles/jobs.css';
class EventDescription extends Component {
   
   constructor(props) {
      super(props); 
      this. state = { 
          registeredEvent:[],
           applyerror:'',
           applysuccess:'',
           showbutton:'block',
           noteligible:''
       }
   }

   componentWillReceiveProps(nextProps)
   {
       console.log("In event description mount")
       this.setState({showbutton:'block'})
       this.setState({applysuccess:''})
   }
   
onEventRegistered = (eventId,major) =>{
    
    console.log(eventId);

      let config = {
      
      headers: {
        Authorization: `${window.localStorage.getItem("student")}`,
      }
    }
    let data={
      event:{
        event_id:eventId,
        major:major
      }
   
  }
    axios.post(`${api_route.host}/events/register`,data,config)
    .then((res)=>{
      this.setState({registeredEvent:res.data})
      this.setState({applysuccess:true})
      this.setState({showbutton:'none'})
    })
    .catch((errors)=>
    {
      if(errors.response){ 

          if(errors.response.data.eligible)
          {
              this.setState({noteligible:errors.response.data.eligible})
          }
          else{
           this.setState({applyerror:'UniqueError'})
            console.log("in catch",errors.response.data);
          }
      }

    })
  }
    


    render() { 
        return ( 
             <div>
            <div className='p-2 ml-3 b-1'> 
            <p style={{fontSize:'24px',fontWeight:'700' ,fontFamily: "Suisse Int",marginBottom: "5px"}}>{this.props.eventdata.event_name}</p>
             <p style={{fontSize:'18px',fontWeight:'500' ,fontFamily: "Suisse Int",color:'rgba(0,0,0,.56)'}}>{this.props.eventdata.company_basic_detail?this.props.eventdata.company_basic_detail.company_name:''}</p>
            </div>
            <div className='d-flex ml-3'>
            <div className='d-flex '>
            <ion-icon name="briefcase"></ion-icon>
            <p style={{color: "rgba(0,0,0,.56)",fontSize:'14px' , }} className='ml-2'>{this.props.eventdata.event_name} Event,</p>
            </div>
            <div className='d-flex ml-2'>
             <ion-icon name="location"></ion-icon>
            <p style={{color: "rgba(0,0,0,.56)",fontSize:'14px' , }} className='ml-2'>{this.props.eventdata.location}  ,</p>
            </div>
            <div className='d-flex ml-2'>
             <ion-icon name="school-outline"></ion-icon>
            <p style={{color: "rgba(0,0,0,.56)",fontSize:'14px' , }} className='ml-2'>{this.props.eventdata.eligibility} majors allowed </p>
            </div>
            </div>

            <div className='style__card___31yrn m-2'>
            <div className='d-flex justify-content-between' style={{fontSize:"20px",fontWeight:'600',alignSelf: "center"}}>
            <p> Registration closes on {this.props.eventdata.date}</p>
           {console.log(this.props.eventdata.isRegister)}
           {
               
               this.props.eventdata.isRegister?'':
            <button id="myBtn" className='btn btn-outline-success' style={{fontSize:"13px",display:this.state.showbutton}} onClick={e=>{
                this.setState({modalShow:'block'})
            }}>Register</button>

           }
            <div id="myModal" className="modal" style={{display:this.state.modalShow}} >


 
            <div className= "modal-content col-5" style={{fontFamily: "Suisse"}}>
            <div className='container'>
            {this.state.applyerror?<p style={{color:'red'}}> Already Register</p>:''}
            {this.state.applysuccess?<p style={{color:'green'}}>Register successfully</p>:''}
               {this.state.noteligible?<p style={{color:'red'}}>{this.state.noteligible}</p>:''}
                <span class="close" onClick={e=>{
                    this.setState({modalShow:'none'})
                    this.setState({applyerror:''})
                }}>&times;</span>
                <p style={{fontSize:'18px',fontWeight:'700'}}>Register for {this.props.eventdata.event_name}</p>
                 <p style={{fontSize:'15px',fontWeight:'500'}}>Organised by {this.props.eventdata.company_basic_detail?this.props.eventdata.company_basic_detail.company_name:''}:</p>
                
                <div style={{display:this.state.showbutton}}>
                <button className='form-control mt-2 btn btn-outline-success' onClick={(e)=>this.onEventRegistered(this.props.eventdata.event_detail_id,this.props.eventdata.eligibility)} >Register</button>
                </div>
               
                </div>
                </div>


            </div>

            </div>

            </div>
            
            <div className='style__card___31yrn m-2'>
            <h4 className='mb-3'>Description about the job</h4>
            <p style={{color: "dodgerblue"}}>{this.props.eventdata.event_description}</p> </div>

            </div>
         );
    }
}
 
export default EventDescription;