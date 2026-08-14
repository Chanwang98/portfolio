(function () {
  'use strict';

  var endpoint = 'https://duwwzswqlgocohowmybb.supabase.co/functions/v1/track-visit';
  var storageKey = 'portfolio_analytics_session';
  var sessionId = sessionStorage.getItem(storageKey);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(storageKey, sessionId);
  }

  var activeStorageKey = storageKey + '_active_' + sessionId;
  var activeElapsedMs = Math.max(0, Number(sessionStorage.getItem(activeStorageKey)) || 0);
  var activeStartedAt = document.visibilityState === 'visible' ? Date.now() : null;

  function activeSeconds() {
    var currentSegment = activeStartedAt === null ? 0 : Date.now() - activeStartedAt;
    var totalMs = Math.max(0, activeElapsedMs + currentSegment);
    sessionStorage.setItem(activeStorageKey, String(totalMs));
    return Math.round(totalMs / 1000);
  }

  function payload(action) {
    return {
      action: action,
      session_id: sessionId,
      page_path: location.pathname + location.search,
      referrer: document.referrer || null,
      language: navigator.language || null,
      screen_width: window.screen && window.screen.width,
      screen_height: window.screen && window.screen.height,
      active_seconds: activeSeconds()
    };
  }

  function send(action, keepalive) {
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload(action)),
      keepalive: Boolean(keepalive),
      credentials: 'omit'
    }).catch(function () {
      // Analytics must never interfere with the portfolio experience.
    });
  }

  send('pageview');
  var heartbeat = window.setInterval(function () {
    if (document.visibilityState === 'visible') send('heartbeat');
  }, 30000);

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden' && activeStartedAt !== null) {
      activeElapsedMs += Date.now() - activeStartedAt;
      activeStartedAt = null;
      send('heartbeat', true);
    } else if (document.visibilityState === 'visible' && activeStartedAt === null) {
      activeStartedAt = Date.now();
      send('heartbeat');
    }
  });

  window.addEventListener('pagehide', function () {
    window.clearInterval(heartbeat);
    if (activeStartedAt !== null) {
      activeElapsedMs += Date.now() - activeStartedAt;
      activeStartedAt = null;
    }
    send('leave', true);
  });
})();
