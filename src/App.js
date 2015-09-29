import React, { Component } from 'react';

// using stack-overflow solution http://stackoverflow.com/questions/22073716/create-a-waveform-of-the-full-track-with-web-audio-api
const visualizeBuffer = (rawBuffer, canvas) => {
  // will passed dynamically
  const paintAreaWidth = canvas.width;
  const paintAreaHeight = canvas.height;
  const context = canvas.getContext('2d');

  const left = rawBuffer.getChannelData(0);
  const samplesCount = left.length;
  const resampledBuffer = new Float64Array(paintAreaWidth * 6)

  let minValue = 1e3;
  let maxValue = -1e3;
  let bucketIndex = 0;
  let currentValue = 0;
  let result = 0;
  let i = 0;
  let j = 0;

  for(i = 0; i < samplesCount; i++) {
    bucketIndex = 0 | (paintAreaWidth * i / samplesCount);
    bucketIndex *= 6;

    currentValue = left[i];

    if (currentValue > 0) {
      resampledBuffer[bucketIndex] += currentValue;
      resampledBuffer[bucketIndex + 1] += 1;
    } else if (currentValue < 0 ) {
      resampledBuffer[bucketIndex + 3] += currentValue;
      resampledBuffer[bucketIndex + 4] += 1;
    }

    if (currentValue < minValue) {
      minValue = currentValue;
    }

    if (currentValue > maxValue) {
      maxValue = currentValue;
    }
  }

  for (i = 0, j = 0; i < paintAreaWidth; i++, j+=6) {
    if (resampledBuffer[j + 1] !== 0) {
      resampledBuffer[j] /= resampledBuffer[j + 1]
    }

    if (resampledBuffer[j + 4] !== 0) {
      resampledBuffer[j + 3] /= resampledBuffer[j + 4]
    }
  }

  for (i = 0; i < left.length; i++) {
    bucketIndex = 0 | (paintAreaWidth * i / left.length);
    bucketIndex = bucketIndex * 6;

    currentValue = left[i];

    if (currentValue > 0) {
      resampledBuffer[bucketIndex + 2] += Math.abs(resampledBuffer[bucketIndex] - currentValue);
    } else if (currentValue < 0) {
      resampledBuffer[bucketIndex + 5] += Math.abs(resampledBuffer[bucketIndex + 3] - currentValue);
    }
  }

  for(i = 0, j = 0; i < paintAreaWidth; i++, j+= 6) {
    if (resampledBuffer[j + 1]) {
      resampledBuffer[j + 2] /= resampledBuffer[j + 1];
    }

    if (resampledBuffer[j + 4]) {
      resampledBuffer[j + 5]  /= resampledBuffer[j + 4]
    }
  }

  context.save();
  context.fillStyle = '#FFF' ;
  context.fillRect(0,0,paintAreaWidth,paintAreaHeight );
  context.translate(0.5, paintAreaHeight / 2);
  context.scale(1, 200);

  for (let k = 0; k < paintAreaWidth; k++) {
    j = k * 6;
    context.strokeStyle = '#4A4A4A';
    context.beginPath();
    context.beginPath();
    context.moveTo( k  , (resampledBuffer[j] - resampledBuffer[j+2] ));
    context.lineTo( k  , (resampledBuffer[j +3] + resampledBuffer[j+5] ) );
    context.stroke();
    //
    context.strokeStyle = '#FFF';
    context.beginPath();
    context.moveTo(k  , (resampledBuffer[j] - resampledBuffer[j+2] ));
    context.lineTo(k  , (resampledBuffer[j] + resampledBuffer[j+2] ) );
    context.stroke();
    //
    context.strokeStyle = '#FFF';
    context.beginPath();
    context.moveTo(k , (resampledBuffer[j+3] + resampledBuffer[j+5] ));
    context.lineTo(k , (resampledBuffer[j+3] - resampledBuffer[j+5] ) );
    context.stroke();
  }
  context.restore();
}

class SoundPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      currentTime: 0
    };
  }

  play() {
    const {context} = this.state;
    const source = context.createBufferSource();
    source.buffer = this.state.buffer;
    source.connect(context.destination);
    this.interval = setInterval(() => this.tick(), 100);
    source.start();
    this.setState({
      source
    });
  }

  stop() {
    this.state.source.stop();
    this.setState({
      currentTime: 0
    });
    clearInterval(this.interval);
  }

  moveSeekBar() {
    const canvas = this.refs.seekbar.getDOMNode();
    const context = canvas.getContext('2d');
    const xCoordinate = this.state.currentTime / this.state.duration * canvas.width
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.strokeStyle = '#F00';
    context.moveTo(Math.round(xCoordinate), 0);
    context.lineTo(Math.round(xCoordinate), canvas.height);
    context.lineWidth = 2;
    context.stroke();
  }

  tick() {
    const currentTime = parseFloat((this.state.currentTime + 0.1).toFixed(2));

    this.setState({
      currentTime
    });

    this.moveSeekBar();
  }

  componentWillMount() {
    console.log('Component will mount!');

    const context = new AudioContext();
    console.log(`context currentTime: ${context.currentTime}`);
    const request = new XMLHttpRequest();
    request.open('GET', this.props.src, true);
    request.responseType = 'arraybuffer';

    request.onload = () => {
      context.decodeAudioData(request.response, (buffer) => {
        const duration = parseFloat((buffer.duration).toFixed(2))
        this.setState({
          buffer,
          duration,
          context,
          isLoading: false,
        });
        visualizeBuffer(buffer, this.refs.canvas.getDOMNode());
      }, (err) => {
        console.log('An error occured', err);
      })
    }

    this.setState({isLoading: true});
    request.send();
  }

  render() {
    const canvasWidth = window.innerWidth - 20;
    return (
      <div>
        <canvas ref="canvas"
                height="150"
                width={canvasWidth}
                style={{position:'absolute', top: 0, left:0}}>
        </canvas>
        <canvas ref="seekbar"
                height="150"
                style={{position:'absolute', top: 0, left:0}}
                width={canvasWidth}>
        </canvas>
        <br></br>
        <div style={{height:'200px'}}></div>
        Here goes the React Sound Player
        <br></br>
        {this.state.currentTime} / {this.state.duration}
        <br></br>
        {this.props.src}
        <br></br>
        <button onClick={this.play.bind(this)} disabled={this.state.isLoading}>Play</button>
        <button onClick={() => {
            this.stop();
          }}>Stop</button>
      </div>
    )
  }
}

export class App extends Component {
  render() {
    return (
      <div>
        <SoundPlayer src={"http://localhost:8080/mp3/a.mp3"}>
        </SoundPlayer>
      </div>
    );
  }
}
