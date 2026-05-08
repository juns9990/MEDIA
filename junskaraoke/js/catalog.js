// 곡 카탈로그 로더 + 카드 렌더러

async function loadCatalog(url = 'junskaraoke/data/songs.json') {
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error('songs.json load failed: ' + res.status);
  return res.json();
}

function renderCatalog(container, songs, onSelect) {
  container.innerHTML = '';
  if (!songs.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'VOL.01 에는 그 노래가 없습니다 — 다음 호를 기대해 주세요.';
    container.appendChild(empty);
    return;
  }

  songs.forEach((song, displayIdx) => {
    const card = document.createElement('article');
    card.className = 'song-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${song.title} — ${song.artist} 재생`);

    const num = String(displayIdx + 1).padStart(2, '0');
    card.innerHTML = `
      <div class="song-num">${num}</div>
      <div class="song-body">
        <h3 class="song-title">${escapeHtml(song.title)}</h3>
        <p class="song-artist"><em>${escapeHtml(song.artist)}</em></p>
        <p class="song-tagline">${escapeHtml(song.tagline || '')}</p>
        <div class="song-meta">
          <span class="song-issue">VOL.${song.volume} · No.${song.issueNumber}</span>
          ${song.genre ? `<span class="song-genre">${escapeHtml(song.genre)}</span>` : ''}
        </div>
      </div>
    `;
    card.addEventListener('click', () => onSelect(song));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(song); }
    });
    container.appendChild(card);
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

window.loadCatalog = loadCatalog;
window.renderCatalog = renderCatalog;
