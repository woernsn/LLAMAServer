import * as express from 'express';
import * as bodyParser from 'body-parser';
import { IMessage } from './IMessage';
import * as TU from './TranslationUtil';
import * as DU from './DatabaseUtil';
import * as XMPP from './xmpp';
import * as AsciiLlama from './asciiLlama';
import { DownstreamXMPPMessage } from './DownstreamXMPPMessage';
import { AndroidNotification } from './AndroidNotification';

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
            console.log("message: " + req.body.message + " from " + req.body.from);
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

async function processMessage(message: IMessage) {
    var targetLanguage: any = await DU.getUserLanguage(message.to);

    var translatedMessageObject: any = await TU.translateMessage(message.message_language, targetLanguage, message.message);
    var translatedMessage = translatedMessageObject.text;

    var firebaseInstanceToken: any = await DU.getFirebaseInstanceToken(message.to);

    //create Notification
    var notification = new AndroidNotification();
    notification.title = message.from;
    notification.body = translatedMessage;

    //create DownstreamXMPPMessage
    var down_stream_message = new DownstreamXMPPMessage();
    down_stream_message.data["translated_message"] = translatedMessage;
    down_stream_message.data["original_message"] = message.message;
    down_stream_message.data["timestamp"] = message.time.toString();
    down_stream_message.to = firebaseInstanceToken;
    down_stream_message.notification = notification;

    XMPP.sendMessage(down_stream_message);
}

var rs = new RESTServer(8888);