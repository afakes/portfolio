import React, { Component } from 'react';

class Education extends Component {
  
  constructor(props) {
    super(props);
  }

  get education() {
    return this.props.education;
  }

  render() {

    let result = [];
    for (let [i, education] of this.education.entries()) {
      result.push(
          <div key={i} className="single_education">
              <div className="first">{education.award}.</div> 
              <div className="second">{education.subject}</div> 
              <div className="third">{education.name} ({education.year})</div>
          </div>
      );
    }
    return (result);
  }

}

export default Education;