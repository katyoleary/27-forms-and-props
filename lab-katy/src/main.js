'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import superagent from 'superagent';

const API_URL='http://www.reddit.com/r/boardgames.json?limit=25';


//SEARCH FORM COMPONENT

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: '', 
      limit: 100,
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSearchInput = this.handleSearchInput.bind(this);
  }

  handleSearchInput(e) {
    this.setState({ topic: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.topicSelect(this.state.topic);
    //finish this event
  }

  render() {
    return (
    <form onSubmit={this.handleSubmit}>
      <input
        type='text'
        name='topicName'
        placeholder='search topic boards'
        value={this.state.topic}
        onChange={handleSearchInput} />
    </form>
    )
  }
}

//SEARCH RESULT LIST COMPONENT

class SearchResultList extends React.Component {
  render() {
    return (
      <section>
        <h1>Search Results</h1>
        { this.state. topicError ?
        <div>
          <h2>That topic doesn't exist</h2>
          <h3>Please make another request</h3>
        </div> :
        <div>
        { this.state.topics ?
        <div>
          <ul>
            <li><a href={this.state.topic.url}>{this.state.topics.title}</a></li>
          </ul>
          </div> 
          }
        </div> 
        }
      </section>
    )
  }
}



// APP COMPONENT

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topics: [],
      topicLookup: {},
      topicError: null
    }
  }

  componentDidUpdate() {
    console.log('__STATE__', this.state);
  }

  componentDidMount() {
    if(!localStorage.topicLookup) {
      try {
        let topicLookup = JSON.parse(localStorage.topicLookup);
        this.setState({ topicLookup });
      }
      catch (err) {
        console.error(err);
      }
    } else {
      superagent.get('https://www.reddit.com/subreddits.json?limit=100')
      .then( res => {
        console.log(res.body.data.children);
        let topicLookup = res.body.data.children.reduce((lookup, n) => {
          lookup[n.data.display_name]= `https://www.reddit.com/r/${n.data.display_name}.json?limit=100`;
          return lookup;
        }, {});
        try {
          localStorage.topicLookup = JSON.stringify(topicLookup);
          this.setState({ topicLookup });
        } catch(err) {
          console.error(err);
        }
      })
      .catch(console.error);
    }
  }

  getTopicsArray() {
    if(!this.state.topicLookup[data.display_name]) {
      this.setState({
        topics: null,
        topicError: ///////
      });
    } else {
      superagent.get(this.state.topicLookup[data.display_name])
      .then( res => {
        this.setState({
          topics: res.body, 
          topicError: null,
        })
      })
      .catch(console.error);
    }
  }

  render() {
    return (
      <section>
        <h1>Reddit Search</h1>
        <SearchForm onSubmit={this.getTopicsArray} />
        <SearchResultList topics={this.state.topics} />
      }
      </section>
    )
  }
}

const container = document.createElement('main');
document.body.appendChild(container);
ReactDom.render(<App />, conatiner);