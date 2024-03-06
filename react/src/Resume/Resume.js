import React, { Component } from 'react';

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
    const data = await response.json();
    return data;
  }

  async componentDidMount() {
    try {
      const data = await this.fetchData('data/resume.json');
      this.setState({ data, loading: false });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  }

  contact(data) {
    let result = [];
    let value = null;
    for (let [i, contact] of data.contacts.entries()) {

      value = contact.value;
      // if value starts with http make it a link
      if (value.startsWith('http')) {
        value = <a target="_new" href={value}>{value}</a>;
      }  

      result.push(<li key={i}><span>{contact.name}</span><span>{value}</span></li>);
    }
    return (<ul>{result}</ul>);
  }

  education(data) {
    let result = [];
    for (let [i, education] of data.education.entries()) {
      result.push(
          <div key={i} className="single_education">
              <div className="first">{education.award}</div> 
              <div className="second">{education.subject}</div> 
              <div className="third">{education.name} ({education.year})</div>
          </div>
      );
    }
    return (result);
  }

  introduction(data) {
    return (
      <p>{data.header.introduction}</p>
    );
  }

  skills(data) {
    let result = [];
    for (let [i, skill] of data.skills.entries()) {
      result.push(
        <li key={i}>
          <span>{skill.level.toFixed(1)}</span>
          <span>{skill.years}</span>
          <span>{skill.name}</span>
        </li>
      );
    }
    return (result);
  }


  ul(items) {
    let result = [];
    for (let [i, item] of items.entries()) {
      result.push(
        <li key={i}>{item}</li>
      );
    }
    return (<ul>{result}</ul>);
  }


  experience(data) {
    let result = [];
    for (let [i, experience] of data.experience.entries()) {

      result.push(
        <section key={i} className="single_experience">
            <h1>{experience.title}</h1>
            <h2>{experience.organisation}</h2>
            <h3>{experience.location}</h3> 
            <h4><span>{experience.date.from}</span> to <span>{experience.date.to}</span></h4> 
            {this.ul(experience.points)}
        </section>
      );
    }
    return (result);
  }

  render() {
    const { data, loading, error } = this.state;

    if (loading) { return <div>Loading...</div>; }
    if (error) { return <div>Error: {error.message}</div>; }

    return (
      <main>
        <section className="picture">
          <img src="https://www.adamfakes.com/images/adam_fakes.jpg" alt="Adam Fakes Profile Picture" title="Adam Fakes Profile Picture" className="profile_picture"/>  
          <p className="motto"></p>
        </section>

        <section className="owner">
          <h1 className="heading">{data.header.heading}</h1>
          <h2 className="subheading">{data.header.subheading}</h2>
          <section className="contact">
              {this.contact(data)}
          </section>            
          <section className="education">{this.education(data)}</section>
        </section>

        <section className="introduction">{this.introduction(data)}</section>

        <section className="experience">
          <h3>Experience</h3>
          <ul>
            {this.experience(data)}
          </ul>
        </section>

        <section className="skills">
          <h3>Skills</h3>
          <ul>
            {this.skills(data)}
          </ul>
        </section>
      </main>
    );
  }

}


export default Resume;