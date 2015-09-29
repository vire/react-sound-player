import React, { Component } from 'react';
import { SeekBar } from './SeekBar';
import { Waveform } from './Waveform';

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

  tick() {
    const currentTime = this.state.currentTime + 0.1;
    this.setState({
      currentTime,
      progress: currentTime / this.state.duration,
    });
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
      }, (err) => {
        console.log('An error occured', err);
      })
    }

    this.setState({isLoading: true});
    request.send();
  }

  render() {
    const canvasWidth = window.innerWidth - 20;
    const canvasHeight = 150;
    return (
      <div>
        <Waveform buffer={this.state.buffer}
                  width={canvasWidth}
                  height={canvasHeight}>
        </Waveform>
        <SeekBar progress={this.state.progress}
                  width={canvasWidth}
                  height={canvasHeight}>
        </SeekBar>
        <br></br>
        <div style={{height:'200px'}}></div>Here goes the React Sound Player
          <br></br>
          {this.state.currentTime} / {this.state.duration}
          <br></br>
          {this.props.src}
          <br></br>
          <button onClick={this.play.bind(this)} disabled={this.state.isLoading}>Play</button>
          <button onClick={() => {this.stop();}}>Stop</button>
      </div>
    )
  }
}

export class App extends Component {
  render() {
    const fileName = `${location.protocol}//${location.hostname}:8080/mp3/a.mp3`
    // const fileName = `${location.protocol}//${location.hostname}:8080/wav/test.wav`
    return (
      <div>
        <SoundPlayer src={fileName} />
      </div>
    );
  }
}
