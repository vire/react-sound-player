import React, { Component } from 'react';
import { downsample } from './waveform-utils';

const WF_BACKGROUND_COLOR = '#FFF';
const WF_CORE_COLOR = '#4A4A4A';
const WF_WRAP_COLOR = '#D2D2D2';

export class Waveform extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isInitialized: false,
    };
  }

  componentWillReceiveProps(props) {
    if (props.buffer && !this.state.isInitialized) {
      this.renderWaveform(props.buffer, this.refs.waveform.getDOMNode());
    }
  }

  shouldComponentUpdate(nextProps) {
    return this.props.buffer !== nextProps.buffer;
  }

  renderWaveform(rawBuffer, canvas) {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const context = canvas.getContext('2d');
    const buffer = downsample(rawBuffer, canvas.width);

    context.save();
    context.fillStyle = WF_BACKGROUND_COLOR;
    context.fillRect(0, 0, canvasWidth, canvasHeight );
    context.translate(0.5, canvasHeight / 2);
    context.scale(1, 200);

    for (let iter = 0; iter < canvasWidth; iter++) {
      const idx = iter * 6;

      context.strokeStyle = WF_CORE_COLOR;
      context.beginPath();
      context.beginPath();
      context.moveTo(iter, (buffer[idx] - buffer[idx + 2]));
      context.lineTo(iter, (buffer[idx + 3] + buffer[idx + 5]));
      context.stroke();
      //
      context.strokeStyle = WF_WRAP_COLOR;
      context.beginPath();
      context.moveTo(iter, (buffer[idx] - buffer[idx + 2]));
      context.lineTo(iter, (buffer[idx] + buffer[idx + 2]));
      context.stroke();
      //
      context.strokeStyle = WF_WRAP_COLOR;
      context.beginPath();
      context.moveTo(iter, (buffer[idx + 3] + buffer[idx + 5]));
      context.lineTo(iter, (buffer[idx + 3] - buffer[idx + 5]));
      context.stroke();
    }
    context.restore();
    this.setState({
      isInitialized: true,
    });
  }

  render() {
    const {
      width,
      height,
    } = this.props;

    const style = {
      position: 'absolute',
      border: '1px solid black',
      top: 0,
      left: 0,
    };
    return (
      <div className="waveform-container">
        <canvas ref="waveform"
                width={width}
                height={height}
                style={style}>
        </canvas>
      </div>
    );
  }
}

Waveform.propTypes = {
  buffer: React.PropTypes.object,
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
};
