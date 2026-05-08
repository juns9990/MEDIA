// 표준 LRC 파서

function parseLRC(text) {
  const meta = {};
  const lines = [];
  const tagRe = /^\[(ti|ar|al|by|offset):(.*)\]$/i;
  const timeRe = /\[(\d{1,2}):(\d{1,2})(?:[.:](\d{1,3}))?\]/g;

  text.split(/\r?\n/).forEach((raw) => {
    const line = raw.trim();
    if (!line) return;

    const m = line.match(tagRe);
    if (m) { meta[m[1].toLowerCase()] = m[2].trim(); return; }

    const stamps = [];
    let match;
    timeRe.lastIndex = 0;
    while ((match = timeRe.exec(line)) !== null) {
      const min = parseInt(match[1], 10);
      const sec = parseInt(match[2], 10);
      const fracStr = match[3] || '0';
      const frac = parseInt(fracStr, 10) / Math.pow(10, fracStr.length);
      stamps.push(min * 60 + sec + frac);
    }
    if (!stamps.length) return;

    const lyric = line.replace(timeRe, '').trim();
    stamps.forEach((t) => lines.push({ time: t, text: lyric }));
  });

  lines.sort((a, b) => a.time - b.time);
  return { meta, lines };
}

function findCurrentLine(lines, currentTime) {
  // 현재 시간 ≤ LRC 라인 시작 시간 중 가장 마지막 인덱스
  if (!lines.length) return -1;
  let lo = 0, hi = lines.length - 1, idx = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (lines[mid].time <= currentTime) { idx = mid; lo = mid + 1; }
    else hi = mid - 1;
  }
  return idx;
}

window.parseLRC = parseLRC;
window.findCurrentLine = findCurrentLine;
