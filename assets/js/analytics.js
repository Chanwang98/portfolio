(function () {
  'use strict';

  var endpoint = 'https://duwwzswqlgocohowmybb.supabase.co/functions/v1/track-visit';
  var storageKey = 'portfolio_analytics_session';
  var sessionId = sessionStorage.getItem(storageKey);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(storageKey, sessionId);
  }

  function payload(action) {
    return {
      action: action,
      session_id: sessionId,
      page_path: location.pathname + location.search,
      referrer: document.referrer || null,
      language: navigator.language || null,
      screen_width: window.screen && window.screen.width,
      screen_height: window.screen && window.screen.height
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

  window.addEventListener('pagehide', function () {
    window.clearInterval(heartbeat);
    send('leave', true);
  });
})();
