const http = require('http');
const app = require('./app')
const port = 8680;
const server = http.createServer(app);
server.listen(port, () => {
    console.log("App executando na porta: ", port)
});
