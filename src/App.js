import React, { Component } from 'react';
import { SoundPlayer } from './SoundPlayer';

export class App extends Component {
  render() {
    const fileName = `${location.protocol}//${location.hostname}:8080/mp3/a.mp3`;
    // const fileName = `${location.protocol}//${location.hostname}:8080/wav/test.wav`
    return (
      <div>
        <SoundPlayer src={fileName} />
      </div>
    );
  }
}
