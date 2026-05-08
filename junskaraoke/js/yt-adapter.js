// YouTube IFrame Player API 어댑터
// 자체 컨트롤만 노출, 유튜브 UI는 완전히 숨김.

let ytApiReadyPromise = null;
function loadYouTubeAPI() {
  if (ytApiReadyPromise) return ytApiReadyPromise;
  ytApiReadyPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) { resolve(window.YT); return; }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => resolve(window.YT);
  });
  return ytApiReadyPromise;
}

class YTAdapter extends PlayerAdapter {
  constructor(mountId) {
    super();
    this.mountId = mountId;
    this.player = null;
    this._duration = 0;
    this._tickHandle = null;
  }

  async load(song) {
    const YT = await loadYouTubeAPI();
    if (this.player) {
      this.player.loadVideoById(song.ytId);
      return;
    }
    return new Promise((resolve) => {
      this.player = new YT.Player(this.mountId, {
        videoId: song.ytId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          showinfo: 0,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          playsinline: 1,
          fs: 0,
          disablekb: 1,
        },
        events: {
          onReady: (e) => {
            this._duration = e.target.getDuration();
            this._startTick();
            resolve();
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.ENDED && this._onEnded) this._onEnded();
            if (e.data === YT.PlayerState.PLAYING) {
              this._duration = this.player.getDuration();
            }
          },
        },
      });
    });
  }

  _startTick() {
    const tick = () => {
      if (!this.player) return;
      if (this._onTimeUpdate) {
        try {
          this._onTimeUpdate(this.player.getCurrentTime(), this.player.getDuration());
        } catch (_) {}
      }
      this._tickHandle = requestAnimationFrame(tick);
    };
    this._tickHandle = requestAnimationFrame(tick);
  }

  play()  { this.player && this.player.playVideo(); }
  pause() { this.player && this.player.pauseVideo(); }
  seek(s) { this.player && this.player.seekTo(s, true); }

  getCurrentTime() { return this.player ? this.player.getCurrentTime() : 0; }
  getDuration()    { return this.player ? (this.player.getDuration() || this._duration) : 0; }

  destroy() {
    if (this._tickHandle) cancelAnimationFrame(this._tickHandle);
    if (this.player) {
      try { this.player.destroy(); } catch (_) {}
      this.player = null;
    }
  }
}

window.YTAdapter = YTAdapter;
