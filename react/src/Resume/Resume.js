import React, { Component } from 'react';
import Section from './Section/Section';

class Resume extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: true,
      error: null,
    };
  }

  async fetchData(url) {
    const response = await fetch(url);
    
    let data = null;
    try { 
      data = await response.json();
    } catch (error) {
      throw new Error('Error fetching data');
    }
   
    return data;
  }

  async componentDidMount() {
    try {
      const data = await this.fetchData('https://raw.githubusercontent.com/afakes/resume/master/resume.json');
      this.setState({ data, loading: false });
      
    } catch (error) {
      this.setState({ error, loading: false });
    }
  }


  sections(sections = []) {
    if (!sections) { return []; }

    let result = [];
    for (let section of sections) {
      result.push( <Section data={section} key={section.type} /> );
    }

    return result;
  }


  render() {
    const { data, loading, error } = this.state;

    if (loading) { return <div>Loading...</div>; }
    if (error) { return <div>ABC Error: {error.message}</div>; }
    
    return (
        <div id="container" key="main" >
          {this.sections(data)}
        </div>      
    );
  }

}


export default Resume;



