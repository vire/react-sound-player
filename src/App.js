import React, { Component } from 'react';
import { SeekBar } from './SeekBar';
import { Waveform } from './Waveform';
import { TimeDisplay } from './TimeDisplay';

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

  play(event, id, ratio = 0) {
    const { context, buffer, isPlaying } = this.state.player;
    const source = context.createBufferSource();
    const seekTime = ratio * buffer.duration;
    if (isPlaying) {
      return; // can't seek twice
    }

    source.buffer = buffer;
    source.connect(context.destination);
    source.start(context.currentTime, seekTime);
    // set state on playback start
    this.setState({
      player: Object.assign({}, this.state.player, {
        source,
        isPlaying: true,
        startTime: context.currentTime
      })
    });

    const timeUpdater = (ts) => {
      const currentTime = this.state.player.context.currentTime - this.state.player.startTime + seekTime;

      if (currentTime >= this.state.player.duration) {
        this.stop(null, null, 0);
      }

      this.setState({
        player: Object.assign({}, this.state.player, {
          progress: currentTime / this.state.player.duration,
          currentTime,
        })
      })

      if (this.state.player.isPlaying) {
        requestAnimationFrame(timeUpdater);
      }
    }

    requestAnimationFrame(timeUpdater)
  }

  stop(event, nodeID, cb) {
    const { player } = this.state;
    player.source.stop(0);
    this.setState({
      player: Object.assign({}, player, {
        isPlaying: false,
      })
    });
    player.source.onended = cb;
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

  seekClickHandler(e) {
    const width = window.innerWidth - 20;
    const ratio = e.clientX / width;
    this.stop(null, null, () => {
      this.play(null, null, ratio);
    });
  }

  render() {
    // console.log('render App');
    const canvasWidth = window.innerWidth - 20;
    const canvasHeight = 150;

    return (
      <div>
        <Waveform buffer={this.state.player.buffer}
                  width={canvasWidth}
                  height={canvasHeight}>
        </Waveform>
        <SeekBar currentTime={this.state.player.currentTime}
                  duration={this.state.player.duration}
                  width={canvasWidth}
                  seekClickHandler={this.seekClickHandler.bind(this)}
                  height={canvasHeight}>
        </SeekBar>
        <TimeDisplay currentTime={this.state.player.currentTime}
                      duration={this.state.player.duration}>
        </TimeDisplay>
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
