#!/usr/bin/env node

const EventSource = require('eventsource');
const childProcess = require('child_process');
const fs = require('fs');
const config = require('./config');

// Retrieves the last date in the log file to resume streaming.
// Returns config.headers.lastLineDate if the log file isn't found.
function getLastEventDate() {
  try {
    const lastLineBuf = childProcess.execSync(`tail -1 ${config.logFilePath}`);
    const lastLine = lastLineBuf.toString('utf8');
    const lastEventDate = lastLine.substring(0, 20);
    if (lastEventDate === '') {
      throw new Error({ message: 'No date found in file.' });
    } else {
      console.log(`Resuming streaming from ${lastEventDate}`);
      return lastEventDate;
    }
  } catch (e) {
    console.log(`File not found... starting from ${config.lastLineDate}`);
    return config.lastLineDate;
  }
}

// Open file stream
const writeStream = fs.createWriteStream(config.logFilePath, {
  flags: 'a',
  encoding: 'utf8',
});

// Open Event Source connection
const eventSource = new EventSource(config.url, {
  headers: {
    Authorization: config.authorization,
    'Last-Event-ID': getLastEventDate(),
  },
});

eventSource.addEventListener('log', (e) => {
  if (e.data !== '') {
    writeStream.write(`${e.data}\n`);
  }
}, false);

eventSource.addEventListener('open', () => {
  console.log(`Connected to ${config.url}`);
}, false);

eventSource.addEventListener('error', (e) => {
  if (e.readyState === EventSource.CLOSED) {
    writeStream.end();
    console.log('Connection was closed');
  }
}, false);
