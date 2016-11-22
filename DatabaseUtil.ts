import * as ConfigUtil from './ConfigUtil';

const https = require('https');
const querystring = require('querystring');

var options = {
    host: ConfigUtil.getApplicationHost(),
    path: ''
}

export async function getFirebaseInstanceToken(userId: string): Promise<Object> {
    var path = querystring.stringify({
        auth: ConfigUtil.getDatabaseToken()
    });

    options.path = "/users/" + userId + "/firebaseInstanceIdToken.json?" + path;

    return new Promise<Object>((resolve, reject) => {
        var request = https.get(options, function (res) {
            console.log("STATUS: " + res.statusCode);
            res.on('data', (d) => {
                var reply = JSON.parse(d.toString('utf8'));
                console.log("D: " + reply);
                resolve(reply);
            });
        });

        request.on('error', function (e) {
            console.log("ERROR: " + e);
            reject(e);
        });
    });
}

export async function getUserLanguage(userId: string): Promise<Object> {
    var path = querystring.stringify({
        auth: ConfigUtil.getDatabaseToken()
    })

    options.path = "/users/" + userId + "/defaultLanguage.json?" + path;

    return new Promise<Object>((resolve, reject) => {
        var request = https.get(options, function (res) {
            console.log("STATUS: " + res.statusCode);
            res.on('data', (d) => {
                var reply = JSON.parse(d.toString('utf8'));
                console.log("D: " + reply);
                resolve(reply);
            });
        });

        request.on('error', function (e) {
            console.log("ERROR: " + e);
            reject(e);
        });
    });
}