//https://github.com/matheuss/google-translate-api

const translate = require('google-translate-api');

export async function translateMessage(message_language: string, reply_language: string, message: string): Promise<Object> {

    return new Promise<Object>((resolve, reject) => {
        translate(message, { from: message_language, to: reply_language })
            .then(
            (translatedMessage: Object) => {
                resolve(translatedMessage);
            },
            (error) => {
                reject(error.message);
            }
            )
            .catch(
            (error) => {
                console.error(error);
            }
            )
    });
}

//TODO make await


//private async translate(text: string): Promise<string> {
//     return new Promise<string>((resolve, reject) => {
//         Translator.translate(text).then(
//             (translatedText: string) => {
//                 resolve(translatedText);
//             },
//             (error) => {
//                 reject(error);
//             });
//     })
// }

// var translatedText = await translate("Hallo");