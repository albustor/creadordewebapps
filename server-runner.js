const { spawn } = require('child_process');
const path = require('path');

const child = spawn('npx', ['next', 'start', '-p', '3001'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

child.on('error', (err) => {
  console.error('Failed to start child process.', err);
});

child.on('exit', (code, signal) => {
  console.log(`Child process exited with code ${code} and signal ${signal}`);
});
