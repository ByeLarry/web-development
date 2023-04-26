import { message } from "./modules/notification.js";


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const threadId = urlParams.get('id');
const messages = document.querySelector('#messages');
if (messages){
    const limit = 10;
    let offset = 11;
    let flag = false;
    window.addEventListener('scroll', async (event) => {
        let documentHeight = document.body.scrollHeight;
        let cuttentScroll = window.scrollY + window.innerHeight  ;
        
        if (documentHeight - cuttentScroll  <= 0 && !flag) {
            flag = true;
            await fetch(`api/message/get?id=${threadId}&offset=${offset}&limit=${limit}`, {
                method: 'GET'
            }).then(response => response.text())
                .then(data => {
                    if (data.length > 0) {
                        messages.insertAdjacentHTML('beforeend', data);
                        flag = false;
                        offset += 10;
                    }
                })
        }
    })
}


const sendMessageButton = document.querySelector('#sendMessageButton');
const messageText = document.querySelector('#sendMessageText');
if (sendMessageButton && messageText){
    sendMessageButton.addEventListener('click', async (event) =>{
        const newMessage = messageText.value.trim();
        if (newMessage){
            messageText.value = '';
            await fetch(`api/message/newMsg`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    threadId: threadId,
                    message: newMessage
                })
            })
            .then(() => {
                location.replace(`/thread?id=${threadId}`);
            })
        }
        else{
            message('Нельзя отправить пустое сообщение!', 'notification');
            event.preventDefault();
        }
    })
}