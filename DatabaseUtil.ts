import * as ConfigUtil from './ConfigUtil';

const https = require('https');
const querystring = require('querystring');

var options = {
    host: ConfigUtil.getApplicationHost(),
    path: ''
}

var authorizationPath = querystring.stringify({
    auth: ConfigUtil.getDatabaseToken()
});

export async function getFirebaseInstanceToken(userId: string): Promise<Object> {
    options.path = "/users/" + userId + "/firebaseInstanceIdToken.json?" + authorizationPath;

    return get(options);
}

export async function getUserLanguage(userId: string): Promise<Object> {
    options.path = "/users/" + userId + "/defaultLanguage.json?" + authorizationPath;

    return get(options);
}

export async function getChat(chatId: string): Promise<Object> {
    options.path = "/chats/" + chatId + "?" + authorizationPath;

    return get(options);
}

async function get(options): Promise<Object> {
    return new Promise<Object>((resolve, reject) => {
        var request = https.get(options, function(res) {
            res.on('data', (d) => {
                var reply = JSON.parse(d.toString('utf8'));
                resolve(reply);
            });
        });

        request.on('error', function(e) {
            console.log("[ERROR]\t" + e);
            reject(e);
        });
    });
}