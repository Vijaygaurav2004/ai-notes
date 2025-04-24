#!/usr/bin/env node

/**
 * This script helps clear any lingering Next.js dev servers
 * that might be causing port conflicts.
 */

const { execSync } = require('child_process');
const os = require('os');

console.log('Checking for Next.js processes on port 3000...');

try {
  let command = '';
  if (os.platform() === 'win32') {
    // Windows command
    command = 'netstat -ano | findstr :3000';
  } else {
    // Mac/Linux command
    command = 'lsof -i :3000';
  }
  
  const result = execSync(command, { encoding: 'utf-8' });
  console.log('Found processes:');
  console.log(result);
  
  console.log('\nTo kill these processes:');
  if (os.platform() === 'win32') {
    console.log('1. Find the PID (last column) from the output above');
    console.log('2. Run: taskkill /F /PID <PID>');
  } else {
    console.log('1. Find the PID (second column) from the output above');
    console.log('2. Run: kill -9 <PID>');
  }
  
  console.log('\nFor example:');
  if (os.platform() === 'win32') {
    console.log('taskkill /F /PID 1234');
  } else {
    console.log('kill -9 1234');
  }
  
  console.log('\nAfter killing the processes, try running npm run dev again.');
} catch (error) {
  console.log('No processes found on port 3000. This is good!');
  console.log('If you\'re still having issues, try:');
  console.log('1. Closing your browser completely and reopening it');
  console.log('2. Clearing browser cache');
  console.log('3. Running npm run dev with a specific port: npm run dev -- -p 3001');
}

console.log('\nTo clear browser cache, visit:');
console.log('http://localhost:3000/reset-cache');
console.log('- or whatever port your app is running on -');
console.log('\nPress Ctrl+C to exit this script.'); 