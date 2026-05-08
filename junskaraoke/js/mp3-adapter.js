// MP3 어댑터 — v0.1 stub
// v0.3에서 IndexedDB 업로드 + SoundTouch 키/템포 본 구현 예정.

class MP3Adapter extends PlayerAdapter {
  constructor() { super(); }
  async load(_song) { throw new Error('MP3Adapter: not implemented in v0.1'); }
  play()  {}
  pause() {}
  seek(_) {}
  getCurrentTime() { return 0; }
  getDuration()    { return 0; }
  destroy() {}
}

window.MP3Adapter = MP3Adapter;
