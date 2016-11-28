import { DownstreamXMPPMessage } from './DownstreamXMPPMessage';
import { AndroidNotification } from './AndroidNotification';
import * as ConfigUtil from './ConfigUtil';

const XMPPClient = require('node-xmpp-client');

var client = new XMPPClient.Client({
	preferredSaslMechanism: 'PLAIN',
	legacySSL: true,
	host: ConfigUtil.getXmppHost(),
	port: ConfigUtil.getXmppPort(),
	jid: ConfigUtil.getXmppJid(),
	password: ConfigUtil.getXmppPassword()
})

client.on('online', function () {
	console.log('[INFO]\tLlama learned how to communicate via XMPP!')
})

client.on('stanza', function (stanza) {
	console.log('[DEBUG]\tI got a response: ' + stanza.root().toString())

})

client.on('error', function (e) {
	console.error(e);
})

export function sendMessage(xmpp_message: DownstreamXMPPMessage) {
	client.send(new XMPPClient.Client.Stanza('message', {
		id: xmpp_message.message_id
		})
		.c('gcm', { xmlns: 'google:mobile:data' })
		.t(
		JSON.stringify(xmpp_message)
		));
}
