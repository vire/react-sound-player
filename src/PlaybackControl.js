import React, { Component } from 'react';

export class PlaybackControl extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // Todo Remove
    const style = {
      width: 35,
      height: 25,
      padding: '5px 0',
      background: 'rgba(255, 255, 255, 0.4)',
      border: '1px dotted black',
      position: 'absolute',
      top: 0,
      left: 5,
      fontSize: 'small',
      textAlign: 'center',
      cursor: 'default',
    };

    const buttonText = this.props.isPlaying ? 'pause' : 'play';

    return (
      <div onClick={this.props.playClickHandler}
          style={style}>
          {buttonText}
      </div>
    );
  }
}

PlaybackControl.propTypes = {
  playClickHandler: React.PropTypes.func.isRequired,
  isPlaying: React.PropTypes.bool.isRequired,
};
