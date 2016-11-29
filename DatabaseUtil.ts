import * as ConfigUtil from './ConfigUtil';
import * as Chat from './IChat';
import * as Message from './Message';

const https = require('https');
const querystring = require('querystring');

var getOptions = {
    host: ConfigUtil.getApplicationHost(),
    path: ''
}

var putOptions = {
    host: ConfigUtil.getApplicationHost(),
    path: '',
    method: 'PUT'
}

var patchOptions = {
    host: ConfigUtil.getApplicationHost(),
    path: '',
    method: 'PATCH'
}

var authorizationPath = querystring.stringify({
    auth: ConfigUtil.getDatabaseToken()
});

export async function getFirebaseInstanceToken(userId: string): Promise<Object> {
    getOptions.path = "/users/" + userId + "/firebaseInstanceIdToken.json?" + authorizationPath;
    return get(getOptions);
}

export function getUserLanguage(userId: string): Promise<Object> {
    getOptions.path = "/users/" + userId + "/defaultLanguage.json?" + authorizationPath;
    return get(getOptions);
}

export async function getChat(chatId: string): Promise<Object> {
    getOptions.path = "/chats/" + chatId + ".json?" + authorizationPath;
    return get(getOptions);
}

export async function getChatMembers(chatId: string): Promise<Object> {
    getOptions.path = "/members/" + chatId + ".json?" + authorizationPath;
    return get(getOptions);
}

export async function getUserName(userId: string): Promise<Object> {
    getOptions.path = "/users/" + userId + "/name.json?" + authorizationPath;
    return get(getOptions);
}

export function updateChat(chatId: string, chat: Chat.IChat) {
    patchOptions.path = "/chats/" + chatId + ".json?" + authorizationPath;
    set(patchOptions, JSON.stringify(chat));
}

export function addMessage(message: Message.IDatabaseMessage, chatId: string) {
    patchOptions.path = "/messages/" + chatId + ".json?" + authorizationPath;
    var newUuid = Message.getMessageUuid();
    var newMessage = {};
    newMessage[newUuid] = message;
    set(patchOptions, JSON.stringify(newMessage));
}

async function get(options): Promise<Object> {
    return new Promise<Object>((resolve, reject) => {
        var request = https.get(options, function (res) {
            res.on('data', (d) => {
                var reply = JSON.parse(d.toString('utf8'));
                resolve(reply);
            });
        });

        request.on('error', function (e) {
            console.log("[ERROR]\t" + e);
            reject(e);
        });
    });
}

function set(options, data: string) {
    var request = https.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    });

    request.on('error', function (e) {
        console.log("[ERROR]\t" + e);
    });

    // put actual data
    request.write(data);
    request.end();
}