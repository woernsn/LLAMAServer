import { AndroidNotification } from './AndroidNotification';

// ----------------------------------------------
// enums
// ----------------------------------------------
export enum MessageType {
    text, multimedia, llama
}

export enum Priority {
    normal,
    high
}



// ----------------------------------------------
// Message types
// ----------------------------------------------
export interface IMessageFromApp {
    type?: MessageType;

    from: string;   // userId
    to: string;     // chatId

    message: string;
    message_language: string;
}

export interface IDatabaseMessage {
    timestamp: Date,
    type: MessageType,
    user: string,

    // optional
    language?: string,  // not needed for multimedia type
    url?: string,
    message?: string,
    translations?: Object
}

export class DownstreamXMPPMessage {
    to: string;
    condition: string;
    message_id: string;
    collapse_key: string;
    priority: Priority;
    content_available: boolean;
    time_to_live: number;
    delivery_receipt_requested: boolean;
    dry_run: boolean;

    data: Object;
    notification: AndroidNotification;

    constructor() {
        this.message_id = downstreamXMPPMessageUuid();
        this.data = {};
    }
}



// ----------------------------------------------
// public functions
// ----------------------------------------------
export function getMessageUuid() {
    var d = new Date().getTime();
    d += process.hrtime()[1];
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return 'm-'+uuid;
}



// ----------------------------------------------
// private functions
// ----------------------------------------------
function downstreamXMPPMessageUuid() {
    var d = new Date().getTime();
    d += process.hrtime()[1];
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}