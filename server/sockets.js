module.exports = function(io) {
  io.on('connection', socket => {
    console.log('SOCKET CONNECTED');

    socket.on('message', msg => {
      console.log('client says: ' + msg);
      io.emit('message', 'hi');
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
