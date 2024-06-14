import React, { Component } from 'react';

import Article from './Article/Article';

class Section extends Component {
  
  constructor(props) {
    super(props);
  }

  get data() {
    return this.props.data;
  }

  articles(section_type = null, articles = null) {
    
    let result = [];
    for (let [i, article] of articles.entries()) {
      let key = `${section_type}_${i}`;
      result.push(<Article key={key} data={article} />);
    }
    return result;
  }

  render() {
    let section = this.data;

    let result = 
      <section id={this.data.type} key={this.data.type}  >
        {(section.title)      ? <h1>{section.title}</h1> : null}
        {(section.heading)    ? <h2>{section.heading}</h2> : null}
        {(section.subheading) ? <h3>{section.subheading}</h3> : null}
        {(section.summary)    ? <h4>{section.summary}</h4> : null}
        
        {this.articles(section.type, section.articles || [])}
        
      </section>;

    return (result);
  }

}

export default Section;