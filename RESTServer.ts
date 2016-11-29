import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as Message from './Message';
import * as Chat from './IChat';
import * as TU from './TranslationUtil';
import * as DU from './DatabaseUtil';
import * as XMPP from './xmpp';
import * as AsciiLlama from './asciiLlama';
import { AndroidNotification } from './AndroidNotification'

export class RESTServer {
    constructor(private port: number) {
        console.log(AsciiLlama.getAsciiLlama());
        console.log("[INFO]\tLlama is waking up...");
        let app = express();

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: true
        }));

        app.post("/", async (req, res) => {
            console.log("[DEBUG]\tmessage: " + req.body.message + " from " + req.body.from);
            if (checkPostData(req.body)) {
                await processMessage(req.body);
                res.status(202).send('Created');
            }
        });

        app.listen(port, () => {
            console.log("[INFO]\tLlama wants food from port " + port + '.');
        })
    }
}

function checkPostData(reqBody): boolean {
    return (StringNotEmpty(reqBody.from) &&
        StringNotEmpty(reqBody.to) &&
        StringNotEmpty(reqBody.message) &&
        StringNotEmpty(reqBody.message_language) &&
        reqBody.time != null);
}

function StringNotEmpty(str: string): boolean {
    if (str == undefined || str.length < 1)
        return false;
    return true;
}

async function processMessage(message: Message.IMessageFromApp) {
    var chatMembers = await DU.getChatMembers(message.to);

    var translatedMessages = {};

    for (var memberId in chatMembers) {
        if (memberId == message.from) {
            continue;
        }
        // create and send message
        var translation = await processTextMessage(memberId, message);
        if (translation['language'] != message.message_language) {
            translatedMessages[translation['language']] = translation['translation'];
        }
    }

    addMessageToDB(message, translatedMessages);
    addMessageToChatToDB(message);

    // insert message to database
    // add to sender
    // var chat: IChat = {
    //     lastMessage: translatedMessage,
    //     timestamp: new Date(),

    // }

    // add to receiver
    //TODO

    // send Translation as message

}

async function processTextMessage(userId, message: Message.IMessageFromApp): Promise<Object> {
    var targetLanguage: any = await DU.getUserLanguage(userId);
    var translatedMessageObject: any = await TU.translateMessage(message.message_language, targetLanguage, message.message);
    var translatedMessage = translatedMessageObject.text;
    var firebaseInstanceToken: any = await DU.getFirebaseInstanceToken(userId);
    var senderName: any = await DU.getUserName(message.from);

    // create Notification
    var notification = new AndroidNotification();
    notification.title = senderName;
    notification.body = translatedMessage;

    // create DownstreamXMPPMessage
    var down_stream_message = new Message.DownstreamXMPPMessage();
    down_stream_message.data["translated_message"] = translatedMessage;
    down_stream_message.data["original_message"] = message.message;
    down_stream_message.data["timestamp"] = new Date();
    down_stream_message.to = firebaseInstanceToken;
    down_stream_message.notification = notification;

    XMPP.sendMessage(down_stream_message);

    return {
        language: targetLanguage,
        translation: translatedMessage
    };
}

function addMessageToDB(message: Message.IMessageFromApp, translatedMessages) {
    // create IDatabaseMessage
    var databaseMessage: Message.IDatabaseMessage = {
        timestamp: new Date(),
        type: Message.MessageType.text,
        user: message.from,

        language: message.message_language,
        message: message.message,

        translations: translatedMessages
    };

    // add new message to database
    DU.addMessage(databaseMessage, message.to);
}

async function addMessageToChatToDB(message: Message.IMessageFromApp) {
    var senderName: any = await DU.getUserName(message.from);
    var modifiedChat: Chat.IChat = {
        timestamp: new Date(),
        lastMessage: senderName + ": " + message.message
    }
    DU.updateChat(message.to, modifiedChat);
}

var rs = new RESTServer(8888);