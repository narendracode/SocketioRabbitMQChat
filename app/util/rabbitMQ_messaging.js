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


      ch.assertExchange('messages', 'topic', {durable: false});
      //setup a queue for receiving messages
      //The fanout exchange is very simple. It just broadcasts all the messages it receives to all the queues it knows.
        
        
        
      //when we supply queue name as an empty string, we create a non-durable queue.
        ch.assertQueue('message-queue', {exclusive: true}, function(err, q){
        //queue instance 'q' contains a random queue name generated by RabbitMQ. For example it may look like amq.gen-JzTY20BRgKO-HjmUJj0wLg
        if(err){
          return callback(err);  
        } 


        //Tell the exchange to send messages to our queue. That relationship between exchange and a queue is called a binding.
        // Using rabbitmqctl list_bindings you can verify that the code actually creates bindings and queues as we want.
            ch.bindQueue(q.queue, 'messages', 'onetoone.msg');         
          
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
              ch.publish('messages', 'onetoone.msg', new Buffer(JSON.stringify(message))); 
              //The empty string as second parameter means that we don't want to send the message to any specific queue. We want only to publish it to our 'logs' exchange.
          }

         
        callback(null, options);

      });//assertQueue

      
    });//create channel
      
  });
}
