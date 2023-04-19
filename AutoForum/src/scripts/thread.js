import { message } from "./modules/notification.js";

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
            await fetch(`api/message/get?id=1&offset=${offset}&limit=${limit}`, {
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
        if (messageText.value){
        }
        else{
            message('Нельзя отправить пустое сообщение!', 'notification');
            event.preventDefault();
        }
    })
}