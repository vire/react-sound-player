import React, { Component } from 'react';
import { downsample } from './waveform-utils';

export class Waveform extends Component {

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(props) {
    console.log('componentWillReceiveProps Waveform()', props)

    if(props.buffer) {
      this.renderWaveform(props.buffer, this.refs.waveform.getDOMNode());
    }
  }

  renderWaveform(rawBuffer, canvas) {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const context = canvas.getContext('2d');
    const buffer = downsample(rawBuffer, canvas.width);

    context.save();
    context.fillStyle = '#FFF' ;
    context.fillRect(0, 0, canvasWidth, canvasHeight );
    context.translate(0.5, canvasHeight / 2);
    context.scale(1, 200);

    for (let k = 0; k < canvasWidth; k++) {
      const idx = k * 6;

      context.strokeStyle = '#4A4A4A';
      context.beginPath();
      context.beginPath();
      context.moveTo(k, (buffer[idx] - buffer[idx + 2]));
      context.lineTo(k, (buffer[idx + 3] + buffer[idx + 5]));
      context.stroke();
      //
      context.strokeStyle = '#A9A9A9';
      context.beginPath();
      context.moveTo(k, (buffer[idx] - buffer[idx + 2]));
      context.lineTo(k, (buffer[idx] + buffer[idx + 2]));
      context.stroke();
      //
      context.strokeStyle = '#A9A9A9';
      context.beginPath();
      context.moveTo(k, (buffer[idx + 3] + buffer[idx + 5]));
      context.lineTo(k, (buffer[idx + 3] - buffer[idx + 5]));
      context.stroke();
    }
    context.restore();
  }

  render() {
    console.log('render: Waveform');
    const {
      width,
      height
    } = this.props;

    return (
      <div className="waveform-container">
        <canvas ref="waveform"
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
