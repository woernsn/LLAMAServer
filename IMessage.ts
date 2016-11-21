export interface IMessage {
    type?: 'text' | 'multimedia' | 'llama';
    
    from: string;
    to: string;
    time: Date;

    message: string;
    message_language: string;
}