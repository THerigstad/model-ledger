'use strict';

// The HTML is complete without JavaScript. Controls below only add interaction.
(() => {
  const table = document.getElementById('scoreboard-table');
  const sortButtons = [...document.querySelectorAll('[data-sort]')];
  if (table && sortButtons.length) {
    const body = table.tBodies[0];
    const originalRows = [...body.rows];
    sortButtons.forEach((button) => {
      button.hidden = false;
      const group = button.closest('[hidden]');
      if (group) group.hidden = false;
      button.addEventListener('click', () => {
        const board = button.dataset.sort;
        const ranked = originalRows.map((row, order) => ({row, order}));
        ranked.sort((a, b) => Number(b.row.getAttribute('data-' + board)) - Number(a.row.getAttribute('data-' + board)) || a.order - b.order);
        ranked.forEach(({row}) => body.appendChild(row));
        sortButtons.forEach((control) => control.setAttribute('aria-pressed', String(control === button)));
        const column = ['answer-key', 'main-result', 'ai-panel', 'final-look'].indexOf(board) + 1;
        [...table.tHead.rows[0].cells].forEach((cell, index) => {
          if (index === column) cell.setAttribute('aria-sort', 'descending');
          else cell.removeAttribute('aria-sort');
        });
        const status = document.getElementById('sort-status');
        if (status) status.textContent = board === 'main-result'
          ? 'In main-result order, as the report lists them.'
          : 'Sorted by ' + board.replaceAll('-', ' ') + ', high to low. Ties keep the report’s order.';
      });
    });
  }

  document.querySelectorAll('[data-video-toggle]').forEach((button) => {
    const video = document.getElementById(button.dataset.videoToggle);
    if (!video) return;
    button.hidden = false;
    video.controls = false;
    const sync = () => {
      button.textContent = video.paused ? 'Play silent clip' : 'Pause silent clip';
      button.setAttribute('aria-pressed', String(!video.paused));
    };
    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);
    video.addEventListener('ended', sync);
    video.addEventListener('error', sync);
    button.addEventListener('click', async () => {
      if (!video.paused) { video.pause(); return; }
      video.muted = true;
      video.controls = true;
      try { await video.play(); } catch { sync(); }
    });
    sync();
  });

  document.querySelectorAll('a[data-film-id]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const id = link.dataset.filmId;
      if (!id || !/^[A-Za-z0-9_-]+$/.test(id)) return;
      event.preventDefault();
      const player = document.createElement('iframe');
      player.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
      player.title = 'Buckingham Palace Dream, the full film';
      player.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      player.allowFullscreen = true;
      player.referrerPolicy = 'strict-origin-when-cross-origin';
      player.className = 'film-iframe';
      player.tabIndex = 0;
      link.replaceWith(player);
      player.focus();
    });
  });
})();
