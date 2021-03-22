module.exports = function(io) {
  io.on('connection', socket => {
    console.info('SOCKET CONNECTED');

    socket.on('message', async msg => {
      console.info(`${socket.id} says ${msg}`);

      let player = await global.world.getPlayerBySocketId(socket.id);

      if (player) {
        console.log('player', player.name);
        player.sendMessage('message', 'hi');
      } else {
        console.log('player not found');
        socket.emit('registrationNeeded', { type: 'message', data: msg });
      }
    });

    socket.on('deregister', async () => {
      console.log('deregister', socket.id);
      let player = await global.world.getPlayerBySocketId(socket.id);

      if (player) player.deregister();
      console.info('user player deregistered');
    });

    socket.on('disconnect', async () => {
      console.info('user disconnected');
    });
  });
};
