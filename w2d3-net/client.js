const net = require('net');

const conn = net.createConnection({
  host: "localhost", 
  port: 3000
});

conn.on('data', (data) => {
  console.log("server says: ", data);
})

conn.on("connect", () => {
  conn.write("Hello from the client!")
})

conn.setEncoding('utf8');