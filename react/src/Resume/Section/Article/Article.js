import React, { Component } from 'react';

class Article extends Component {
  
  constructor(props) {
    super(props);
  }

  get data() {
    return this.props.data;
  }


  render_key_values(data) {

    let key_values = data || [];

    let result = [];

    for (let [i, key_value] of key_values.entries()) {
      
      let value = key_value.value;
      
      // if value starts with http, then create a link
      if (value.startsWith("http")) {
        let link = value;
        let text = value;
        if (text.endsWith("/")) { text = text.substring(0, text.length - 1); }  // remove end slash from text
        text = text.replace("http://", "").replace("https://", "");
        
        value = <a target="_new" href={link}>{text}</a>;
      }
      
      result.push(
        <li key={i}>
          <span className="key">{key_value.key}</span><span className="value">{value}</span>
        </li>
      );
    }
    
    return result;
  }

  render_points(data) {
    
    let points = data || [];
    let result = [];
    
    for (let [i, point] of points.entries()) {
      result.push(
        <li key={i}>
          {point}
        </li>
      );
    }

    return result;
  }

  render() {
    let article = this.data;

    let result = 
      <article id={this.data.type} key={this.data.type}  >
        {(article.heading)    ? <h2>{article.heading}</h2> : null}
        {(article.subheading) ? <h3>{article.subheading}</h3> : null}
        {(article.summary)    ? <h4>{article.summary}</h4> : null}
        

        {/* key values */}
        <ul className="key_value">
          {this.render_key_values(article.key_value)}
        </ul>

        {/* points */}
        <ul className="points">
          {this.render_points(article.points)}
        </ul>

      </article>;

    return (result);
  }

}

export default Article;