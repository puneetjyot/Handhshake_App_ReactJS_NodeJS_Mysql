import React, { Component } from "react";
class StudentBar extends Component {
  state = {};
  render() {
    return (
      <div>
        <div className="p-2">
          <div class="card mt-4">
            {/* <div>{this.props.studentdata.name}</div>
            <div class="card-body">
              <h4 class="card-title">{this.props.studentdata.school_name}</h4>
              <p class="card-text">
               
              </p>
            </div> */}
            <div className="m-3">
             <h3 style={{fontSize:'20px',fontWeight:'600'}}> {this.props.studentdata ? this.props.studentdata.name : ""}</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StudentBar;
