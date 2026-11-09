import { spawn } from 'node:child_process';

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

const services = [
  { name: 'api', args: ['run', 'dev', '--workspace=apps/api'] },
  { name: 'web', args: ['run', 'dev', '--workspace=apps/web'] }
];

const children = [];
let shuttingDown = false;

function killChild(child, signal = 'SIGTERM') {
  if (!child || child.exitCode !== null || child.killed) return;
  try {
    if (!isWindows && child.pid) {
      process.kill(-child.pid, signal);
    } else {
      child.kill(signal);
    }
  } catch {
    // Ignore already-exited processes
  }
}

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    killChild(child, 'SIGTERM');
  }

  const forceTimer = setTimeout(() => {
    for (const child of children) {
      killChild(child, 'SIGKILL');
    }
    process.exit(exitCode);
  }, 1500);
  forceTimer.unref();

  Promise.all(
    children.map(
      (child) =>
        new Promise((resolve) => {
          if (child.exitCode !== null) return resolve();
          child.once('close', resolve);
        })
    )
  ).then(() => {
    clearTimeout(forceTimer);
    process.exit(exitCode);
  });
}

for (const svc of services) {
  const child = spawn(npmCmd, svc.args, {
    stdio: 'inherit',
    detached: !isWindows,
    shell: isWindows
  });

  child.on('exit', (code, signal) => {
    if (!shuttingDown) {
      const failed = code !== null && code !== 0;
      if (failed) {
        console.error(`\n[${svc.name}] exited unexpectedly (code=${code}, signal=${signal ?? 'none'}). Stopping remaining services...`);
      }
      shutdown(failed ? code : 0);
    }
  });

  children.push(child);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
process.on('SIGHUP', () => shutdown(0));

