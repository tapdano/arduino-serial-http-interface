const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const EventEmitter = require('events');
const http = require('http');

class ArduinoConnection extends EventEmitter {
  static READY_MESSAGE = 'STARTED';
  static SUCCESS_MESSAGE = 'OK';

  constructor(path, baudRate) {
    super();
    this.port = new SerialPort({ path, baudRate });
    this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\n' }));
    this.port.on('open', () => this._onOpen());
    this.parser.on('data', data => this._onData(data));
    process.on('SIGINT', () => this._onClose());
  }

  _onOpen() {
    console.log('Serial port opened');
  }

  _onData(data) {
    const message = data.trim();
    if (message === ArduinoConnection.READY_MESSAGE) {
      this.emit('ready');
    }
  }

  _onClose() {
    this.port.close(() => {
      console.log('Serial port closed');
      process.exit(1);
    });
  }

  sendCommand(command) {
    return new Promise((resolve, reject) => {
      this.port.write(command + '\n', err => {
        if (err) {
          return reject(new Error('Error on write: ' + err.message));
        }
        const onData = (data) => {
          const message = data.trim();
          if (message === ArduinoConnection.SUCCESS_MESSAGE) {
            this.parser.off('data', onData);
            resolve(message);
          }
        };
        this.parser.on('data', onData);
      });
    });
  }
}

const arduino = new ArduinoConnection('COM5', 9600);

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === '/move') {
      const response = await arduino.sendCommand('MOVE');
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(response);
      return;
    }
    if (req.url === '/move1') {
      const response = await arduino.sendCommand('MOVE1');
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(response);
      return;
    }
    if (req.url === '/move2') {
      const response = await arduino.sendCommand('MOVE2');
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(response);
      return;
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`Error: ${error.message}`);
    return;
  }
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

arduino.on('ready', () => {
  console.log('Arduino is ready');
  server.listen(3000, () => {
    console.log('Server is listening on http://localhost:3000');
  });
});