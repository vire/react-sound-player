import React, { Component } from 'react';
import moment from 'moment';

export class TimeDisplay extends Component {
  constructor(props) {
    super(props);
  }

  _formatTime(time) {
    const _time = moment.duration(time, 'seconds');
    const minutes = _time.minutes() < 10 ? `0${_time.minutes()}` : _time.minutes();
    const seconds = _time.seconds() < 10 ? `0${_time.seconds()}` : _time.seconds();
    return `${minutes}:${seconds}`;
  }

  render() {
    const style = {
      position: 'absolute',
      width: 100,
      height: 20,
      textAlign: 'center',
      background: 'rgba(255, 255, 255, 0.7)',
      top: 2,
      right: 20,
    };

    return (
      <div style={style}>
        <span>
          {this._formatTime(this.props.currentTime)} / {this._formatTime(this.props.duration)}
        </span>
      </div>
    );
  }
}

TimeDisplay.propTypes = {
  currentTime: React.PropTypes.number.isRequired,
  duration: React.PropTypes.number,
};
