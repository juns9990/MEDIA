// PlayerAdapter — YT/MP3 어댑터 공통 인터페이스
// v0.1: yt-adapter만 실제 구현, mp3-adapter는 stub.

class PlayerAdapter {
  async load(song) { throw new Error('load() not implemented'); }
  play()           { throw new Error('play() not implemented'); }
  pause()          { throw new Error('pause() not implemented'); }
  seek(seconds)    { throw new Error('seek() not implemented'); }
  getCurrentTime() { return 0; }
  getDuration()    { return 0; }
  setOnTimeUpdate(cb) { this._onTimeUpdate = cb; }
  setOnEnded(cb)      { this._onEnded = cb; }
  destroy() {}
}

window.PlayerAdapter = PlayerAdapter;
