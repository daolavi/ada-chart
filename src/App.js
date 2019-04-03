import React, { Component } from 'react';
import moment from 'moment';
import './App.css';
import LineChart from './LineChart';
import ToolTip from './ToolTip';
import InfoBox from './InfoBox';
var _ = require('lodash');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingData: true,
      data: null,
      hoverLoc: null,
      activePoint: null
    }
  }
  handleChartHover(hoverLoc, activePoint){
    this.setState({
      hoverLoc: hoverLoc,
      activePoint: activePoint
    })
  }
  componentDidMount(){
    const getData = () => {
      const url = 'https://api.coinstats.app/public/v1/charts?period=1y&coinId=cardano';

      fetch(url).then( r => r.json())
        .then((historicalData) => {
          const sortedData = [];
          let count = 0;
          _.forEach(historicalData.chart, function(data){
            sortedData.push({
              d: moment.unix(data[0]).format('MMM DD'),
              p: data[1].toLocaleString('us-EN',{ style: 'currency', currency: 'USD', maximumSignificantDigits: 5 }),
              x: count,
              y: data[1]
            });
            count++;
          });
          this.setState({
            data: sortedData,
            fetchingData: false
          })
        })
        .catch((e) => {
          console.log(e);
        });
    }
    getData();
  }
  render() {
    return (

      <div className='container'>
        <div className='row'>
          <h1>1 Year ADA Price Chart</h1>
        </div>
        <div className='row'>
          { !this.state.fetchingData ?
          <InfoBox data={this.state.data} />
          : null }
        </div>
        <div className='row'>
          <div className='popup'>
            {this.state.hoverLoc ? <ToolTip hoverLoc={this.state.hoverLoc} activePoint={this.state.activePoint}/> : null}
          </div>
        </div>
        <div className='row'>
          <div className='chart'>
            { !this.state.fetchingData ?
              <LineChart data={this.state.data} onChartHover={ (a,b) => this.handleChartHover(a,b) }/>
              : null }
          </div>
        </div>
        <div className='row'>
          <div id="CoinStats"> Powered by <a href="https://coinstats.app/">CoinStats</a></div>
        </div>
      </div>

    );
  }
}

export default App;
