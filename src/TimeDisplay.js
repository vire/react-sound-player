import React, { Component } from 'react';
import moment from 'moment';

export class TimeDisplay extends Component {
  constructor(props) {
    super(props);
  }

  _formatTime(time) {
    const t = moment.duration(time, 'seconds');
    const hours = '';
    const minutes = t.minutes() < 10 ? `0${t.minutes()}` : t.minutes() ;
    const seconds = t.seconds() < 10 ? `0${t.seconds()}` : t.seconds() ;
    return `${minutes}:${seconds}`
  }

  render() {
    return (
      <div
      style={{width:'100px', textAlign: 'center', height: '20px', background: 'rgba(255, 255, 255, 0.69)', position: 'absolute', top:2, right: 20}}>
        <span>{this._formatTime(this.props.currentTime)} / {this._formatTime(this.props.duration)}</span>
      </div>
    )
  }
}
