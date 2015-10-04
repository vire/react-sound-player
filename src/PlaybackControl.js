import React, { Component } from 'react';

export class PlaybackControl extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div onClick={this.props.playClickHandler}
            style={{width:45, height:45, background:'#F00', position:'absolute', top:0, left:5}}>
        PlayButton
      </div>
    )
  }
}
