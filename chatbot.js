

// Ativar permissões
const qrcode = require('qrcode-terminal'); //Permite gerar QRCODE para conectar com whatsapp
const { Client } = require('whatsapp-web.js'); // Automatizar o envio de mensagens
const { MessageMedia } = require('whatsapp-web.js'); // Para enviar mídia(fotos,videos,pdf´s)


//Configuração para rodar a biblioteca do whatsapp-web
const client = new Client({
    puppeteer:{ //permite o uso do navegador sem a interface grafica
        headless:true,
    }
});

// Sistemas de contextos
const userContexts = {};

function setUserContext(userId, context){
    userContexts[userId] = {
        context: context,
        timestamp: Date.now()
    };
}

function getUserContext(userId){
    return userContext[userId]?.context || null;
}

//Configuração do Qrcode
client.on('qr', qr =>{
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Bot Whatsapp conectado!');
});


//Delay e receber mensagens
const delay = ms => new Promisse(res => setTimeout(res,ms));

client.on('message', async msg =>{


    //Proteção para não enviar em grupos de whatsapp conectado

    //verificações de segurança 
    if (msg.isGroup) return;
    if (!msg.from.endWith('@c.us')) return;
    const chat = await msg.getChat();
    if (chat.isGroup) return;

    const userId = msg.from;
    const userMessage = msg.body.toLowerCase();
    const currentContext = getUserContext(userId);
    const contact = await msg.getContact();
    const name = contact.pushname;
    
    //Função segura para envio 
    const safeSendMessage = async(message) =>{
        const finalChat = await msg.getChat();
        if (finalChat.isGroup) return;
        try {
            await client.sendMessage(msg.from,message);
        } catch (error){
            console.error('Erro ao enviar mensagem', error);
        }

    };

    //Fim das configurações
    //------------------------------------------------------------------------------

    //Seleção de categorias com lista de produtos

    //palavras chave de ativação de categoria
    if(/teclado|teclados/i.test(userMessage)){
        setUserContext(userId, 'teclados');
        await delay(1000); // entendendo a mensagem

    }


});