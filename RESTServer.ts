import * as express from 'express';
import * as bodyParser from 'body-parser';
import { IMessage } from './IMessage';
import * as TU from './TranslationUtil';

export class RESTServer {
    constructor(private port: number) {
        let app = express();

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: true
        }));

        app.post("/", async (req, res) => {
            console.log("message: " + req.body.message + " from " + req.body.from);
            if (checkPostData(req.body))
                await processMessage(req.body);
        });

        app.listen(port, () => {
            console.log("REST server running at port " + port);
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
    var translatedMessage: any = await TU.translateMessage(message.message_language, "DE", message.message);
    console.log("Translated to DE:" + translatedMessage.text);
}

var rs = new RESTServer(8888);