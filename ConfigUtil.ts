import fs = require('fs');

var configFile = 'llama.config.json';

export function getApplicationHost(): string {
    var config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    return config.application_host;
}

export function getXmppHost(): string {
    var config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    return config.xmpp_host;
}

export function getXmppPort(): number {
    var config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    return config.xmpp_port;
}

export function getXmppJid(): string {
    var config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    return config.xmpp_jid;
}

export function getXmppPassword(): string {
    var config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    return config.xmpp_password;
}

export function getDatabaseToken(): string {
    var config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    return config.database_token;
}