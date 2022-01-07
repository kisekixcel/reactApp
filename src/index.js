import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

var firstLoad = true;

class Ats extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: '' }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.getATSCode = this.getATSCode.bind(this);
    this.generateRandomATS = this.generateRandomATS.bind(this);
    this.deleteATS = this.deleteATS.bind(this);
    this.obtainATS = this.obtainATS.bind(this);
  }



  handleSubmit(event) {
    var val = parseInt(this.state.value)
    var that = this;
    that.setState({ overlay: { display: 'block' } })
    this.getATSCode().then(function (ats) {
      if (val === ats) {
        that.deleteATS().then(function (response) {
          that.setState({ status: response })
        }).then(function () {
          that.obtainATS();
        })
      } else {
        that.setState({ status: 'wrong ATS entered' })
      }
    })
    event.preventDefault();
  }

  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  deleteATS() {
    var that = this;
    return fetch(`https://tranquil-eyrie-80940.herokuapp.com/api/ats/delete-ats`, {
      method: 'DELETE',
    }).then(function (response) {
      return response.json()
    }).then(function (response) {
      return response.deleteMessage
    })
  }

  getATSCode() {
    return fetch(`https://tranquil-eyrie-80940.herokuapp.com/api/ats/1`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    }).then(function (response) {
      return response.json();
    }).then(function (response) {
      if (response.error) {
        return response.error
      } else {
        return response.ats;
      }
    })
  }

  generateRandomATS() {
    let that = this;
    that.setState({ overlay: { display: 'block' } })
    return fetch(`https://tranquil-eyrie-80940.herokuapp.com/api/ats/random-ats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json.error) {
        throw new Error(json.error);
      }
      return json.random;
    }).then(function () {
      that.obtainATS();
    })
      .catch(function (error) {
        console.log(error.message)
        if (error) {
          throw new Error(error.message)
        }
        return error.message
      })
  }

  obtainATS() {
    var that = this;
    this.getATSCode().then(function (ats) {
      if (ats) {
        that.setState({ ats: ats })
      }
      that.setState({ overlay: { display: 'none' } })
    });
  }

  render() {
    if (firstLoad == true) {
      this.obtainATS()
      firstLoad = false;
    }
    return (
      <div>

        <h1>Generate ATS</h1>
        <button id="ATS-RandomGenerator" onClick={() => { this.generateRandomATS(); }}>
          Generate Random ATS
        </button>

        <h1>Generated ATS</h1>
        <p id='GeneratedATS'>{this.state.ats}</p>

        <h1>Submit ATS</h1>
        <form onSubmit={this.handleSubmit}>
          <input id="ATSCodeInput" value={this.state.value} onChange={this.handleChange} />
          <button id="ATS-Submit" type='submit' >Submit</button>
        </form>
        <p id="status">{this.state.status || ''}</p>

        <div id="loading" style={this.state.overlay}>
          <div id="spinner-wrapper">
            <span id="spinner-text">LOADING</span>
            <span id="spinner"></span>
          </div>
        </div>
      </div>


    )
  }
}

ReactDOM.render(<Ats />, document.getElementById('root'))