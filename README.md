# ActionFPS Log Stream
A CLI utility to stream the logs served by ActionFPS using EventSource to a file.

## Install
Install from npm using
    `npm install -g actionfps-log-stream`
## Usage

* ### Basic
  ```
  actionfps-log-stream [output path]
  ```
* ### Authentication
  ```
  AUTHORIZATION="Bearer [token here]" actionfps-log-stream [output path]
  ```

* ### Specify a start date
  ```
  DEFAULT_START_TIME="2016-01-02T03:04:05Z" actionfps-log-stream [output path]
  ```
