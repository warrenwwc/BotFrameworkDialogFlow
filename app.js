var restify = require('restify');
var builder = require('botbuilder');
var apiairecognizer = require('api-ai-recognizer');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Create dialogflow
var recognizer = new apiairecognizer('607b26a2ca33496087768aaeb4c27033'); 
var intents = new builder.IntentDialog({ recognizers: [recognizer] });

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector);

bot.dialog('/',intents);

intents.matches('translate.text',function(session, args){
  console.log(args);
  var ful = builder.EntityRecognizer.findEntity(args.entities,'fulfillment'); 
  if (ful){ 
    var ans = ful.entity 
  };
  session.send(ans); 
});

intents.onDefault(function(session){
  session.send("Sorry...can you please rephrase?"); 
  console.log(intents);
});