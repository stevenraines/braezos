module.exports = function(io) {
  io.on('connection', socket => {
    console.info('SOCKET CONNECTED');

    socket.on('message', msg => {
      console.info('client says: ' + msg);
      io.emit('message', 'hi');
    });

    socket.on('disconnect', () => {
      console.info('user disconnected');
    });
  });
};
