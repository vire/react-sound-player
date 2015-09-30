import React, { Component } from 'react';
import { SeekBar } from './SeekBar';
import { Waveform } from './Waveform';

class SoundPlayer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      seekBar: {
        currentTime: 0,
      },
      player: {
        context: null,
        buffer: null,
        source: null,
        isLoading: false,
        isPlaying: false,
        currentTime: 0
      }
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.player.buffer !== nextState.player.buffer;
  }

  play() {
    const { context, buffer, isPlaying } = this.state.player;
    const source = context.createBufferSource();

    if (isPlaying) {
      console.log('Can\'t trigger play twice');
      return
    }

    source.buffer = buffer;
    source.connect(context.destination);
    source.start();
    // set state on playback start
    this.setState({
      player: Object.assign({}, this.state.player, {
        source,
        isPlaying: true,
        startTime: context.currentTime
      })
    });
  }

  stop() {
    const { player } = this.state;
    player.source.stop();
    this.setState({
      player: Object.assign({}, player, {
        isPlaying: false,
      })
    });
  }

  componentWillMount() {
    const context = new AudioContext();
    this.setState({
      player: Object.assign({}, this.state.player, {
        context,
        isLoading: true
      })
    });
    this._requestFile(this.props.src)
      .then(response => {
        context.decodeAudioData(response, (buffer) => {
          this.setState({
            player: Object.assign({}, this.state.player, {
              buffer,
              duration: parseFloat((buffer.duration).toFixed(2)),
              isLoading: false,
            })
          });
        })
      });
  }

  render() {
    console.log('render App');
    const canvasWidth = window.innerWidth - 20;
    const canvasHeight = 150;
    return (
      <div>
        <Waveform buffer={this.state.player.buffer}
                  width={canvasWidth}
                  height={canvasHeight}>
        </Waveform>
        <SeekBar {...this.state.seekBar}
                  width={canvasWidth}
                  height={canvasHeight}>
        </SeekBar>
        <br></br>
        <div style={{height:'200px'}}></div>
        Here goes the React Sound Player
        <br></br>
        {this.props.src}
        <br></br>
        <button onClick={this.play.bind(this)} disabled={this.state.isLoading}>Play</button>
        <button onClick={() => {this.stop();}}>Stop</button>
      </div>
    )
  }

  _requestFile(URL) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', URL, true);
        request.responseType = 'arraybuffer';
        request.onload = () => {
          resolve(request.response);
        }
        request.send();
    })
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
