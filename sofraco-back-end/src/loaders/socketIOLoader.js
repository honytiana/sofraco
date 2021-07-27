const socketIO = require('socket.io');
const http = require('http');
const document = require('../handlers/documentHandler');

module.exports = async ({ app }) => {
    const httpServer = http.createServer(app);
    const io = socketIO(httpServer, {
        cors: {
            origin: '*'
        },
        path: '/api/api-status',
        methods: ['GET']
    });
    io.on('connection', (socket) => {
        console.log('Client connected');
    });
    io.on('connect', (socket) => {
        console.log('Client connected');
    });
    io.on('disconnect', (reason) => {
        console.log(reason);
    });
    console.log('socket.io');
}

// const onConnection = (socket) => {
//     document(io, socket);
// }
