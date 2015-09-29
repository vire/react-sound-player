import React, { Component } from 'react';

export class SeekBar extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    this.renderSeekBar(nextProps.progress);
  }

  renderSeekBar(progress) {
    const canvas = this.refs.seekBar.getDOMNode();
    const context = canvas.getContext('2d');
    const xCoordinate = progress * canvas.width;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.strokeStyle = '#F00';
    context.moveTo(Math.round(xCoordinate), 0);
    context.lineTo(Math.round(xCoordinate), canvas.height);
    context.lineWidth = 2;
    context.stroke();
  }

  render() {
    const {
      width,
      height
    } = this.props;

    return (
      <div>
        <canvas ref="seekBar"
                width={width}
                height={height}
                style={{
                  position:'absolute',
                  border: '1px solid black',
                  top: 0,
                  left:0}}>
        </canvas>
      </div>
    )
  }
}
