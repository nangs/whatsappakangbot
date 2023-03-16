const axios = require('axios');
const { MessageMedia } = require('whatsapp-web.js');
const { API_KEY_OPEN_AI } = require('../config');
const { Client } = require('whatsapp-web.js');

const ImageAIHandler = async (text, msg) => {

    const cmd = text.split('.');

    if (cmd.length < 2) {
        return msg.reply('Format Salah. ketik *img.your question*');
    }

	
    //msg.reply('sedang diproses, tunggu bentar ya.');
	

    const question = cmd[1];
    const response = await ImageGPTRequest(question);

    if (!response.success) {
        return msg.reply(response.message);
    }
	
	const media = await MessageMedia.fromUrl(response.data);
	
	
	const chat = await msg.getChat();
    
    //return chat.sendMessage(media, {caption: "Image"}); 
	
     chat.sendMessage(media); 
}


const ImageGPTRequest = async (text) => {

    const result = {
        success: false,
        data: "Aku gak tau",
        message: "",
    }

    return await axios({
        method: 'post',
        url: 'https://api.openai.com/v1/images/generations',
        data: {
			prompt: text,
			n: 1,
            size: "512x512"
        },
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer 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'
        },
    })
        .then((response) => {
            if (response.status == 200) {

                const { data } = response.data;

                if (data && data.length) {
                    result.success = true;
                    result.data = data[0].url;
                }

            } else {
                result.message = "Failed response";
            }

            return result;
        })
        .catch((error) => {
            result.message = "Error : " + error.message;
            return result;
        });
}

module.exports = {
    ImageAIHandler
}