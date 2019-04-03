import React, { Component } from 'react';
import moment from 'moment';
import './InfoBox.css';
var _ = require('lodash');

class InfoBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPrice: null,
      change24hD: null,
      change24hP: null,
      updatedAt: null
    }
  }
  componentDidMount(){
    this.getData = () => {
      const {data} = this.props;
      const url = 'https://api.coinstats.app/public/v1/charts?period=24h&coinId=cardano';

      fetch(url).then(r => r.json())
        .then((data24h) => {
          const first = _.head(data24h.chart);
          const last = _.last(data24h.chart);

          const price = last[1];
          const change = price - first[1];
          const changeP = change / first[1] * 100;
          const updatedAt = moment.unix(last[0]);
          this.setState({
            currentPrice: price,
            change24hD: change.toLocaleString('us-EN',{ style: 'currency', currency: 'USD', maximumSignificantDigits: 5 }),
            change24hP: changeP.toFixed(2) + '%',
            updatedAt: updatedAt
          })
        })
        .catch((e) => {
          console.log(e);
        });
    }
    this.getData();
    this.refresh = setInterval(() => this.getData(), 90000);
  }
  componentWillUnmount(){
    clearInterval(this.refresh);
  }
  render(){
    return (
      <div id="data-container">
        { this.state.currentPrice ?
          <div id="left" className='box'>
            <div className="heading">{this.state.currentPrice.toLocaleString('us-EN',{ style: 'currency', currency: 'USD', maximumSignificantDigits: 5 })}</div>
            <div className="subtext">{'Updated ' + moment(this.state.updatedAt ).fromNow()}</div>
          </div>
        : null}
        { this.state.currentPrice ?
          <div id="middle" className='box'>
            <div className="heading">{this.state.change24hD}</div>
            <div className="subtext">Change Since Last 24h (USD)</div>
          </div>
        : null}
          <div id="right" className='box'>
            <div className="heading">{this.state.change24hP}</div>
            <div className="subtext">Change Since Last 24h (%)</div>
          </div>

      </div>
    );
  }
}

export default InfoBox;
