# arduino-serial-http-interface

This repository contains a Node.js script that establishes a serial connection with an Arduino and provides an HTTP interface to send commands. It utilizes the `serialport` library to communicate with the Arduino and `http` module to create a web server that listens for specific routes to send commands to the Arduino.

## Features

- Establishes a serial connection with an Arduino device.
- Provides an HTTP server to send commands to the Arduino.
- Handles specific routes ('/move', '/move1', '/move2') to trigger commands.

## Usage
1. Modify the serial port path and baud rate in the script as needed:
    `javascript const arduino = new ArduinoConnection('COM5', 9600);`

2. Start the server:
   `sh node script.js`
   
4. The server will be listening on `http://localhost:3000`. You can access the following routes to send commands to the Arduino:
  - `http://localhost:3000/move`
  - `http://localhost:3000/move1`
  - `http://localhost:3000/move2`

## License
This project is licensed under the MIT License.
