import { DownstreamXMPPMessage } from './DownstreamXMPPMessage';
import { AndroidNotification } from './AndroidNotification';
import * as ConfigUtil from './ConfigUtil';

var XMPPClient = require('node-xmpp-client');

let message = new DownstreamXMPPMessage();
let notification = new AndroidNotification();
notification.title = "Much Notification...";
notification.body = "... such even more wow!";
notification.icon = "llama_launcher.png";

message.notification = notification;
message.to = 'cnQosO7Po5s:APA91bE8KZk2Q2xRKoPymBkDjuf_gtcxyLDGgVUs-YM44SJCupLR_8dv-hhJ2NBHc_C06PLDzrt0FqBu707uHFKnJV8a6siidIQxvY2gboGy_KZ4ZucyobI0E44hlyqsDA9GEgxPj0hJ';

var client = new XMPPClient.Client({
	preferredSaslMechanism: 'PLAIN',
	legacySSL: true,
	host: ConfigUtil.getXmppHost(),
	port: ConfigUtil.getXmppPort(),
	jid: ConfigUtil.getXmppJid(),
	password: ConfigUtil.getXmppPassword()
})

client.on('online', function() {
    console.log('online')
		client.send(new XMPPClient.Client.Stanza('message', {
			id: 'ABCDEFGHIJK'
		})
    .c('gcm', { xmlns: 'google:mobile:data' } )
		.t(
			JSON.stringify(message)
		)
  )
})

client.on('stanza', function (stanza) {
    console.log('Sending response: ' + stanza.root().toString())

})

client.on('error', function (e) {
  console.error(e)
})
