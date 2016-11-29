export interface IChat {
    lastMessage: string;
    timestamp: Date;
    type?: IChatType; // not needed for updates
    
    // optional attributes: for groups only
    title?: string;
    owner?: string;
}

export enum IChatType {
    group, dialog
}