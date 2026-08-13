import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.95.0/+esm';

const SUPABASE_URL = 'https://duwwzswqlgocohowmybb.supabase.co';
const PUBLISHABLE_KEY = 'sb_publishable_VVsjij_XFVkC0a4VS1XIaw_JxR4CZeA';
const ADMIN_EMAIL = 'wangyaochen963@126.com';
const ADMIN_URL = 'https://chanwang98.github.io/portfolio/admin/';
const supabase = createClient(SUPABASE_URL, PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

const $ = (selector) => document.querySelector(selector);
const authCard = $('#authCard');
const dashboard = $('#dashboard');
const authMessage = $('#authMessage');
const dashboardMessage = $('#dashboardMessage');
const authForm = $('#authForm');
const resetForm = $('#resetForm');
let refreshTimer;

function setAuthMessage(message, isError = false) {
  authMessage.textContent = message;
  authMessage.classList.toggle('error', isError);
}

function showDashboard(show) {
  authCard.hidden = show;
  dashboard.hidden = !show;
  if (!show) window.clearInterval(refreshTimer);
}

function showPasswordReset(show) {
  authCard.hidden = false;
  dashboard.hidden = true;
  authForm.hidden = show;
  resetForm.hidden = !show;
  window.clearInterval(refreshTimer);
  if (show) $('#newPassword').focus();
}

async function signIn(event) {
  event.preventDefault();
  setAuthMessage('正在登录…');
  const email = $('#email').value.trim().toLowerCase();
  const password = $('#password').value;
  if (email !== ADMIN_EMAIL) return setAuthMessage('该邮箱没有后台访问权限。', true);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return setAuthMessage(error.message === 'Invalid login credentials' ? '邮箱或密码不正确。' : error.message, true);
  showDashboard(true);
  await loadStats();
  startRefresh();
}

async function signUp() {
  setAuthMessage('正在创建管理员账号…');
  const email = $('#email').value.trim().toLowerCase();
  const password = $('#password').value;
  if (email !== ADMIN_EMAIL) return setAuthMessage('只能使用已授权的管理员邮箱注册。', true);
  if (password.length < 8) return setAuthMessage('密码至少需要 8 位。', true);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: ADMIN_URL }
  });
  if (error) return setAuthMessage(error.message, true);
  if (data.session) {
    showDashboard(true);
    await loadStats();
    startRefresh();
  } else {
    setAuthMessage('账号已创建。请前往邮箱完成验证，然后返回此页登录。');
  }
}

async function requestPasswordReset() {
  const email = $('#email').value.trim().toLowerCase();
  if (email !== ADMIN_EMAIL) return setAuthMessage('该邮箱没有后台访问权限。', true);
  setAuthMessage('正在发送密码重置邮件…');
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: ADMIN_URL });
  if (error) return setAuthMessage(error.message, true);
  setAuthMessage('重置邮件已发送。请在邮箱中打开链接，并在本页面设置新密码。');
}

async function updatePassword(event) {
  event.preventDefault();
  const password = $('#newPassword').value;
  const confirmation = $('#confirmPassword').value;
  if (password.length < 8) return setAuthMessage('新密码至少需要 8 位。', true);
  if (password !== confirmation) return setAuthMessage('两次输入的密码不一致。', true);
  setAuthMessage('正在更新密码…');
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return setAuthMessage(error.message, true);
  await supabase.auth.signOut();
  history.replaceState(null, '', ADMIN_URL);
  resetForm.reset();
  showPasswordReset(false);
  setAuthMessage('密码已更新，请使用新密码登录。');
}

async function cancelPasswordReset() {
  await supabase.auth.signOut();
  history.replaceState(null, '', ADMIN_URL);
  resetForm.reset();
  showPasswordReset(false);
  setAuthMessage('已取消密码重置。');
}

async function loadStats() {
  dashboardMessage.textContent = '';
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return showDashboard(false);
  const days = $('#rangeSelect').value;
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-stats?days=${days}`, {
      headers: { apikey: PUBLISHABLE_KEY, Authorization: `Bearer ${session.access_token}` }
    });
    if (response.status === 401) {
      await supabase.auth.signOut();
      showDashboard(false);
      return setAuthMessage('登录状态已过期，请重新登录。', true);
    }
    if (response.status === 403) throw new Error('当前账号没有管理员权限。');
    if (!response.ok) throw new Error('数据加载失败，请稍后重试。');
    render(await response.json());
    $('#updatedAt').textContent = `最近更新：${new Date().toLocaleString('zh-CN')}`;
  } catch (error) {
    dashboardMessage.textContent = error.message;
  }
}

function render(data) {
  $('#onlineValue').textContent = data.summary.online;
  $('#todayValue').textContent = data.summary.today_views;
  $('#visitorsValue').textContent = data.summary.unique_visitors;
  $('#viewsValue').textContent = data.summary.pageviews;
  renderTrend(data.timeseries);
  renderHours(data.hourly);
  renderLocations(data.locations, data.summary.pageviews);
  renderRecent(data.recent);
}

function renderTrend(points) {
  const host = $('#trendChart');
  const width = 900, height = 260, pad = 34;
  const max = Math.max(1, ...points.flatMap((p) => [p.views, p.visitors]));
  const x = (i) => pad + (points.length === 1 ? 0 : i * (width - pad * 2) / (points.length - 1));
  const y = (value) => height - pad - value * (height - pad * 2) / max;
  const line = (key) => points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join(' ');
  const grid = [0, .25, .5, .75, 1].map((v) => `<line x1="${pad}" y1="${y(max * v)}" x2="${width-pad}" y2="${y(max*v)}" />`).join('');
  const labels = points.filter((_, i) => i === 0 || i === points.length - 1 || i % Math.max(1, Math.ceil(points.length / 6)) === 0)
    .map((p, i, a) => `<text x="${x(points.indexOf(p))}" y="252" text-anchor="middle">${p.date.slice(5)}</text>`).join('');
  host.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img"><g class="grid">${grid}</g><path class="line views" d="${line('views')}"/><path class="line users" d="${line('visitors')}"/>${labels}</svg>`;
}

function renderHours(hours) {
  const max = Math.max(1, ...hours.map((h) => h.views));
  $('#hourChart').innerHTML = hours.map((h) => `<div class="hour-bar" title="${h.hour}:00 · ${h.views} 次"><i style="height:${Math.max(3, h.views / max * 100)}%"></i><span>${h.hour % 4 === 0 ? h.hour : ''}</span></div>`).join('');
}

function renderLocations(items, total) {
  const host = $('#locationList');
  if (!items.length) return host.innerHTML = '<p class="empty">暂无地区数据</p>';
  host.innerHTML = items.map((item) => `<div class="location-row"><div><strong>${escapeHtml(item.name)}</strong><span>${item.count} 次</span></div><div class="progress"><i style="width:${Math.max(3, item.count / Math.max(1, total) * 100)}%"></i></div></div>`).join('');
}

function renderRecent(items) {
  const body = $('#recentBody');
  if (!items.length) return body.innerHTML = '<tr><td colspan="6" class="empty">暂无访问记录</td></tr>';
  body.innerHTML = items.map((item) => {
    const active = Date.now() - new Date(item.last_seen).getTime() < 90000;
    return `<tr><td>${new Date(item.first_seen).toLocaleString('zh-CN')}</td><td>${escapeHtml([item.country, item.city].filter(Boolean).join(' · ') || '未知')}</td><td><code>${escapeHtml(item.ip_masked || '未知')}</code></td><td>${escapeHtml(item.page_path || '/')}</td><td class="ua">${escapeHtml(deviceName(item.user_agent))}</td><td><span class="status ${active ? 'online' : ''}">${active ? '在线' : '已离开'}</span></td></tr>`;
  }).join('');
}

function deviceName(ua = '') {
  const device = /iPhone/i.test(ua) ? 'iPhone' : /Android/i.test(ua) ? 'Android' : /iPad/i.test(ua) ? 'iPad' : '电脑';
  const browser = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : /Firefox\//.test(ua) ? 'Firefox' : '浏览器';
  return `${device} · ${browser}`;
}

function escapeHtml(value) {
  const div = document.createElement('div');
  div.textContent = String(value);
  return div.innerHTML;
}

function startRefresh() {
  window.clearInterval(refreshTimer);
  refreshTimer = window.setInterval(loadStats, 30000);
}

authForm.addEventListener('submit', signIn);
resetForm.addEventListener('submit', updatePassword);
$('#signUpBtn').addEventListener('click', signUp);
$('#forgotPasswordBtn').addEventListener('click', requestPasswordReset);
$('#cancelResetBtn').addEventListener('click', cancelPasswordReset);
$('#refreshBtn').addEventListener('click', loadStats);
$('#rangeSelect').addEventListener('change', loadStats);
$('#logoutBtn').addEventListener('click', async () => { await supabase.auth.signOut(); showDashboard(false); setAuthMessage('已安全退出。'); });

const hashParams = new URLSearchParams(location.hash.slice(1));
const searchParams = new URLSearchParams(location.search);
let recoveryMode = hashParams.get('type') === 'recovery' || searchParams.get('type') === 'recovery';
const callbackError = hashParams.get('error_description') || searchParams.get('error_description');

supabase.auth.onAuthStateChange((event) => {
  if (event === 'PASSWORD_RECOVERY') {
    recoveryMode = true;
    showPasswordReset(true);
    setAuthMessage('身份验证成功，请设置新密码。');
  }
});

const { data: { session } } = await supabase.auth.getSession();
if (callbackError) {
  history.replaceState(null, '', ADMIN_URL);
  showPasswordReset(false);
  setAuthMessage('邮件链接无效或已过期，请重新发起验证或密码重置。', true);
} else if (recoveryMode && session) {
  showPasswordReset(true);
  setAuthMessage('身份验证成功，请设置新密码。');
} else if (session) {
  showDashboard(true);
  await loadStats();
  startRefresh();
}
