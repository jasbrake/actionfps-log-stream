#!/usr/bin/env node

const EventSource = require('eventsource')
const childProcess = require('child_process')
const fs = require('fs')

const authorization = process.env.AUTHORIZATION
const defaultStartTime = process.env.DEFAULT_START_TIME || '2012-01-02T03:04:05Z'
const url = 'https://actionfps.com/logs'
const args = process.argv.slice(2)
const filePath = args[0]

// Retrieves the last date in the log file to resume streaming.
// Returns config.headers.lastLineDate if the log file isn't found.
function getLastLogTime () {
  try {
    const lastLineBuf = childProcess.execSync(`tail -1 ${filePath}`)
    const lastLine = lastLineBuf.toString('utf8')
    const lastEventDate = lastLine.substring(0, 20)
    if (lastEventDate === '') {
      throw new Error({ message: 'No date found in file.' })
    } else {
      console.log(`Resuming streaming from ${lastEventDate}`)
      return lastEventDate
    }
  } catch (e) {
    console.log(`File not found... starting from ${defaultStartTime}`)
    return defaultStartTime
  }
}

// Open file stream
const writeStream = fs.createWriteStream(filePath, {
  flags: 'a',
  encoding: 'utf8'
})

// Open Event Source connection
const eventSource = new EventSource(url, {
  headers: {
    Authorization: authorization,
    'Last-Event-ID': getLastLogTime()
  }
})

eventSource.addEventListener('log', (e) => {
  if (e.data !== '') {
    writeStream.write(`${e.data}\n`)
  }
}, false)

eventSource.addEventListener('open', () => {
  console.log(`Connected to ${url}`)
}, false)

eventSource.addEventListener('error', (e) => {
  console.log(JSON.stringify(e, null, 2))
}, false)
