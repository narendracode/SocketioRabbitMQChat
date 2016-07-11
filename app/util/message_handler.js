var rabbitMQHandler = require('./rabbitMQ_messaging');

module.exports = messageHandler;

function messageHandler(io){
   rabbitMQHandler('amqp://admin:admin@localhost/', function(err, options){
    
    if(err){
       throw err;  
    }

    options.onMessageReceived = onMessageReceived;

    io.on('connection', websocketConnect);

    function websocketConnect(socket){

      console.log('New connection')
      
      socket.on('disconnect', socketDisconnect);
      socket.on('message', socketMessage);
      
      function socketDisconnect(e){
        console.log('Disconnect ', e);
      }

      function socketMessage(message){
        console.log("Socket event 'message' ");
        options.emitMessage(message);
      }
    }

    function onMessageReceived(message){
      console.log("onMessageReceived before emitting 'message' ");
      io.emit('message', message);
    }

   });
}
