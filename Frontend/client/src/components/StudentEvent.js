import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import EventDescription from './EventDescription'
import axios from 'axios'
import api_route from '../app-config'
import '../styles/jobs.css'
class StudentEvent extends Component {
    state = { 
      eventobj:'',
      perEventArr:[],
      eventArr:[],
      isRegister:false
     }

     componentDidMount()
     {
let config = {
      headers: {
        Authorization: `${window.localStorage.getItem("student")}`
      }
    };
    console.log("mounting in events------------");
    //this.setState({educationarr:this.props.educationData})
    try {
      console.log("In try block");
      axios
        .get(`${api_route.host}/events/`, config)
        .then(res => {
          this.setState({ eventArr: res.data.result });
          this.setState({ perEventArr: res.data.result });
          this.setState({eventobj:res.data.result[0]})
          console.log(res.data.result);
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
     }


     filterByTitleOrLocation = (value) =>{
        let result=[]
   console.log(value)
    this.state.perEventArr.map(i=>{
    //console.log( i.company_basic_detail.company_name.indexOf(value))
     if(i.location.toLowerCase().indexOf(value)>=0||i.location.indexOf(value)>=0
     || i.event_name.toLowerCase().indexOf(value)>=0 || i.event_name.indexOf(value)>=0
     )
     {
       result.push(i)
     }
     
   })
   this.setState({eventArr:result})

     }


     getRegisteredEvents = ()=>
     {
       let config = {
      headers: {
        Authorization: `${window.localStorage.getItem("student")}`
      }
    };
       try{
        axios
        .get(`${api_route.host}/events/registered`, config)
        .then(res => {
          this.setState({ eventArr: res.data.result });
          // this.setState({ perEventArr: res.data.result });
          // this.setState({eventobj:res.data.result[0]})
          console.log(res.data.result);
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
     }


  isRegistered = (eventId) =>{
    
      let data={
            event:{
              event_id:eventId
            }
      }

    let config = {
      headers: {
        Authorization: `${window.localStorage.getItem("student")}`
      }
    };
       try{
       const pr= axios
        .post(`${api_route.host}/events/isregistered`,data, config)
        .then(res => {
          this.setState({ isRegister: res.data.result.registered });
          // this.setState({ perEventArr: res.data.result });
          // this.setState({eventobj:res.data.result[0]})
          console.log(res.data.result);
          return true;
        })
        .catch(err => {
          
          console.log(err);
          return false;
        });
    } catch (err) {
      
      console.log(err);
      return false;
    }
  }

    render() { 
     //   console.log(this.props.authStudent)
        if (!localStorage.getItem('student')) {
      return <Redirect to="/student/login" />;
    }
        return ( 
           <div className='maindiv '>
           <div className='style__secondary-nav___3_H_G pb-2 mb-3' align='center'>
            <h2 className='ml-5' style={{fontSize:'20px',fontWeight:'600'}}>Event Search</h2>
            </div>
                <div className='container mt-3'>
                <div className="card">
                <div className="card-body d-flex ">
                 <div className="d-flex col-9">
                 <div className='m-2' style={{left:"40px",position:'relative'}}>
                 <ion-icon name="search"></ion-icon>
                 </div>
                 <input type='text' className='form-control p-2 pl-5' placeholder='Event titles or locations'
                 onChange={e=>{
                   this.filterByTitleOrLocation(e.target.value)
                 }}
                 />
                </div>
                <div className="d-flex ml-1">
                <button className='style__pill___3uHDM' onClick={(e)=>{
                this.getRegisteredEvents()
                }}>Registered Events</button>
                 </div>
                </div>
                </div>

                </div>

                <div className='container'>
                <div className='row mt-3'>
                
                <div className='col-5'>
                <div className='card' style={{height:"500px"}}>
                <div className='style__jobs___3seWY'>
                <h4 className='m-2' style={{fontWeight:"200px",fontSize:'18px'}}> All the upcoming events are shown here</h4>
              {this.state.eventArr?this.state.eventArr.map(i=>(

              
               <div key={i.event_detail_id}>
                <div className='style__selected___1DMZ3 p-2 mt-3 jobdiv m-1 card' onClick={ async(e)=>{

                  // const ss= await this.isRegistered(i.event_detail_id)
                  // console.log(this.state.isRegister)
                  // if(this.state.isRegister)
                  // {
                    
                  //   i.push({isRegister:this.state.isRegister})
                  //   console.log(JSON.stringify(i))
                  // // }


            let data={
                      event:{
                        event_id:i.event_detail_id
                      }
                }

                  let config = {
                    headers: {
                      Authorization: `${window.localStorage.getItem("student")}`
                    }
                  };
                    try{
                    const pr= axios
                      .post(`${api_route.host}/events/isregistered`,data, config)
                      .then(res => {
                        this.setState({ isRegister: res.data.result.registered });
                        //  i.push({isRegister:this.state.isRegister})
                        i=Object.assign(i,{isRegister:this.state.isRegister})
                        i=Object.assign(i,{showButton:'block'})
                         console.log(i)
                        // this.setState({ perEventArr: res.data.result });
                        // this.setState({eventobj:res.data.result[0]})
                        console.log(res.data.result);
                        this.setState({eventobj:i})
                        
                      })
                      .catch(err => {
                        
                        console.log(err);
                        this.setState({eventobj:i})
                      
                      });
                  } catch (err) {
                    
                    console.log(err);
                    this.setState({eventobj:i})
                    
                  }
                   
                
                }}>
                <div className='d-flex'>
                 <ion-icon name="briefcase"></ion-icon>
                <h3 className='ml-2' style={{fontSize:'16px',fontWeight:'700'}}>{i.event_name}</h3>

                </div>
                <h3 style={{fontSize:'16px',fontWeight:'400'}}>{i.company_basic_detail.company_name}</h3>
                <h3 style={{color:"rgba(0,0,0,.56)",fontWeight:"200px",fontSize:'14px'}}>{i.location} </h3>
                </div>
                </div>
))
:''}
               
                </div>

                </div>
                </div>
                <div className='col-7'>
                 <div className='card' style={{height:"500px"}}>
                 <div className='style__jobs___3seWY'>
                    <EventDescription eventdata={this.state.eventobj}/>
                 </div>
                 </div>
                </div>
                
                
                </div>
                </div>
            
            </div>
         );
    }
}
 
export default StudentEvent