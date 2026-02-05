const { spawn, execSync } = require('child_process');
const path = require('path');

const ENDPOINT = 'http://127.0.0.1:7244/ingest/fc0fd57c-00b9-4980-affa-2a3b4cd560ee';
function log(location, message, data, hypothesisId) {
  fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location,
      message,
      data: data || {},
      timestamp: Date.now(),
      sessionId: 'debug-session',
      hypothesisId: hypothesisId || null
    })
  }).catch(() => {});
}

const root = path.resolve(__dirname, '..');

// #region agent log
log('debug-dev-restart.js:start', 'Script started', { root, platform: process.platform }, 'H5');
// #endregion

// Kill node (Windows)
if (process.platform === 'win32') {
  try {
    // #region agent log
    log('debug-dev-restart.js:before-kill', 'About to taskkill node.exe', {}, 'H2');
    // #endregion
    execSync('taskkill /F /IM node.exe 2>nul', { stdio: 'ignore', windowsHide: true });
    // #region agent log
    log('debug-dev-restart.js:after-kill', 'taskkill completed', {}, 'H2');
    // #endregion
  } catch (e) {
    // #region agent log
    log('debug-dev-restart.js:kill-error', 'taskkill error (maybe no node running)', { code: e.status, signal: e.signal }, 'H2');
    // #endregion
  }
}

// #region agent log
log('debug-dev-restart.js:before-spawn', 'Spawning npm run dev', { cwd: root }, 'H3');
// #endregion

const child = spawn('npm', ['run', 'dev'], {
  cwd: root,
  shell: true,
  stdio: ['ignore', 'pipe', 'pipe']
});

let stdout = '';
let stderr = '';
child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });

// #region agent log
log('debug-dev-restart.js:spawned', 'Child process spawned', { pid: child.pid }, 'H5');
// #endregion

child.on('error', (err) => {
  // #region agent log
  log('debug-dev-restart.js:child-error', 'Child process error', { message: err.message, code: err.code }, 'H3');
  // #endregion
});

child.on('exit', (code, signal) => {
  // #region agent log
  log('debug-dev-restart.js:exit', 'Child process exited', {
    code,
    signal,
    stdoutSnippet: stdout.slice(-800),
    stderrSnippet: stderr.slice(-800)
  }, 'H4');
  // #endregion
});

// After 8s capture whether still running and if port 3000 is in use (H1)
setTimeout(() => {
  let portInUse = false;
  try {
    if (process.platform === 'win32') {
      const out = execSync('netstat -ano | findstr :3000', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
      portInUse = out.trim().length > 0;
    }
  } catch (_) {}
  // #region agent log
  log('debug-dev-restart.js:after-8s', 'Status after 8s', {
    childAlive: !child.killed,
    port3000InUse: portInUse,
    stdoutLen: stdout.length,
    stderrLen: stderr.length
  }, 'H1');
  // #endregion
}, 8000);
