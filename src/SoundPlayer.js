import React from 'react';
import { SeekBar } from './SeekBar';
import { Waveform } from './Waveform';
import { TimeDisplay } from './TimeDisplay';
import { PlaybackControl } from './PlaybackControl';
export class SoundPlayer extends React.Component {

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
        currentTime: 0,
      },
    };
  }

  componentWillMount() {
    const context = new AudioContext();
    this.setState({
      player: Object.assign({}, this.state.player, {
        context,
        isLoading: true,
      }),
    });

    this._requestFile(this.props.src)
      .then(response => {
        context.decodeAudioData(response, (buffer) => {
          this.setState({
            player: Object.assign({}, this.state.player, {
              buffer,
              duration: parseFloat((buffer.duration).toFixed(2)),
              isLoading: false,
            }),
          });
        });
      });
  }

  _startPlayback(seekTime) {
    const { context, buffer, isPlaying } = this.state.player;
    const source = context.createBufferSource();

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
        startTime: context.currentTime,
      }),
    });

    const timeUpdater = () => {
      const currentTime = this.state.player.context.currentTime - this.state.player.startTime + seekTime;

      if (currentTime >= this.state.player.duration) {
        this.stop(null, null, 0);
      }

      this.setState({
        player: Object.assign({}, this.state.player, {
          progress: currentTime / this.state.player.duration,
          currentTime,
        }),
      });

      if (this.state.player.isPlaying) {
        requestAnimationFrame(timeUpdater);
      }
    };

    requestAnimationFrame(timeUpdater);
  }

  _stopPlayback(cb) {
    const { player } = this.state;
    player.source.stop(0);
    this.setState({
      player: Object.assign({}, player, {
        isPlaying: false,
      }),
    });
    player.source.onended = cb;
  }

  play(event, id, ratio = 0) {
    this._startPlayback(ratio);
  }

  seekClickHandler(event) {
    const width = window.innerWidth - 20;
    const ratio = event.clientX / width;
    const seekTime = ratio * this.state.player.buffer.duration;
    this._stopPlayback(() => {
      this._startPlayback(seekTime);
    });
  }

  playClickHandler() {
    if (!this.state.player.isPlaying) {
      this.play(null, null, this.state.player.currentTime);
    } else {
      this._stopPlayback();
    }
  }

  _requestFile(URL) {
    return new Promise((resolve) => {
      const request = new XMLHttpRequest();
      request.open('GET', URL, true);
      request.responseType = 'arraybuffer';
      request.onload = () => {
        resolve(request.response);
      };
      request.send();
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
                  height={canvasHeight} />
        <TimeDisplay currentTime={this.state.player.currentTime}
                      duration={this.state.player.duration} />
        <SeekBar currentTime={this.state.player.currentTime}
                  duration={this.state.player.duration}
                  width={canvasWidth}
                  seekClickHandler={this.seekClickHandler.bind(this)}
                  height={canvasHeight} />
        <PlaybackControl playClickHandler={this.playClickHandler.bind(this)}
            isPlaying={this.state.player.isPlaying}/ >
      </div>
    );
  }
}

SoundPlayer.propTypes = {
  src: React.PropTypes.string.isRequired,
};
