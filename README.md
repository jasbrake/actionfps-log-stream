# ActionFPS Log Stream
Streams the logs served by ActionFPS using EventSource to a file.

## Running
*   Create the file `config.js` in the root folder

    Example `config.js` file:
    ```javascript
    module.exports = {
      logFilePath: 'test.log',
      url: 'https://actionfps.com/logs',
      authorization: '', // Can be left blank if you don't have a JWT
      lastLineDate: '2017-05-04T00:00:00Z',
    };
    ```
*   Run `npm install && node index`
