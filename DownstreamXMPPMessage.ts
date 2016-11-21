import { AndroidNotification } from './AndroidNotification';

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

    data: Map<string, string>;
    notification: AndroidNotification;

    constructor() {
        this.message_id = uuid();
    }
}

function uuid() {
    var d = new Date().getTime();
    d += process.hrtime()[1];
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

export enum Priority {
    normal,
    high
}