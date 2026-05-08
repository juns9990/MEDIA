// 검색 로직 — 제목/가수/전체, 대소문자 무시, 한글 includes()

function filterSongs(songs, query, mode) {
  if (!query || !query.trim()) return songs;
  const q = query.toLowerCase().trim();
  return songs.filter((song) => {
    const title  = (song.title  || '').toLowerCase();
    const artist = (song.artist || '').toLowerCase();
    if (mode === 'title')  return title.includes(q);
    if (mode === 'artist') return artist.includes(q);
    return title.includes(q) || artist.includes(q);
  });
}

function debounce(fn, ms) {
  let h = null;
  return (...args) => {
    if (h) clearTimeout(h);
    h = setTimeout(() => fn(...args), ms);
  };
}

window.filterSongs = filterSongs;
window.debounce = debounce;
