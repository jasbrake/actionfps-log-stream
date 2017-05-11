# ActionFPS Log Stream
A CLI utility to stream the logs served by ActionFPS using EventSource to a file.

## Install
Install from npm using `npm install -g actionfps-log-stream`

## Usage

**Basic**
  ```
  actionfps-log-stream [output path]
  ```

**Authorization**
  ```
  AUTHORIZATION="Bearer [token here]" actionfps-log-stream [output path]
  ```

**Default Start Time**
  ```
  DEFAULT_START_TIME="2016-01-02T03:04:05Z" actionfps-log-stream [output path]
  ```

## Process Management with PM2

Running ActionFPS Log Stream with a process manager will fork it into a background process, and automatically restart and continue streaming where it left off on reboots and crashes. [PM2](http://pm2.keymetrics.io/) is a good option.

```
$ npm install -g pm2
$ npm install -g actionfps-log-stream
```
Run with
```
$ pm2 start actionfps-log-stream -- test-log.tsv
```
View the currently running processes:
```
$ pm2 list
```
Stop the process
```
$ pm2 stop actionfps-log-stream
```
View a PM2 command cheatsheet [here](http://pm2.keymetrics.io/docs/usage/quick-start/#cheatsheet)

## Using PM2 with environment variables

If environment variables are needed (for example, AUTHORIZATION or DEFAULT_START_TIME),  you can create a [PM2 process file](http://pm2.keymetrics.io/docs/usage/application-declaration/#process-file).

Create the file *actionfps-log-stream.config.js*:
```
module.exports = {
  apps: [
    {
      name: 'actionfps-log-stream',
      script: 'actionfps-log-stream',
      args: 'test-log.tsv',
      env: {
        AUTHORIZATION: 'Bearer [token here]',
        DEFAULT_START_TIME: '2016-01-02T03:04:05Z',
      },
    }
  ]
};
```

And then run with
```
$ pm2 start actionfps-log-stream.config.js
```
