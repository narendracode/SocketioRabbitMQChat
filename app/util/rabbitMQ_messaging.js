var amqp = require('amqplib/callback_api');

module.exports = rabbitMQMessages;

function rabbitMQMessages(address, callback){
  //connect to RabbitMQ
  amqp.connect(address, function amqpConnectCallback(err, conn){
    if(err){
       console.log("Problem connecting to RabbitMQ: "+err);
      return callback(err);  
    }
    
    //create a channel
    conn.createChannel(function(err, ch){
      if(err){
        return callback(err);  
      } 


      ch.assertExchange('messages', 'fanout', {durable: false});
      //setup a queue for receiving messages
      ch.assertQueue('', {exclusive: true}, function(err, q){
        if(err){
          return callback(err);  
        } 


        ch.bindQueue(q.queue, 'messages', '');         
          
        var options = {
          emitMessage: emitMessage
        };

        //listen for messages
        ch.consume(q.queue, function(msg){
          console.log("Consume message from Queue %s", msg.content.toString());
          options.onMessageReceived(JSON.parse(msg.content.toString())); 
        }, {noAck: true});


          function emitMessage(message){
              //Publish Message to queue
              console.log("Publish Message to Queue : "+JSON.stringify(message));
              ch.publish('messages', '', new Buffer(JSON.stringify(message))); 
          }

         
        callback(null, options);

      });//assertQueue

      
    });//create channel
      
  });
}
