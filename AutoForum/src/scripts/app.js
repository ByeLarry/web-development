import { errorMessage } from './modules/notification.js';

/* const errorMessage = (error) => {
    const notification = document.querySelector('.notification');
    if (notification) {
        notification.remove();
    }
    const newNotification = document.createElement('div');
    newNotification.textContent = error;
    newNotification.classList.add('notification');
    document.body.appendChild(newNotification);
    newNotification.addEventListener('click', function() {
        newNotification.style.display = 'none';
    });
} */

const input = document.querySelector('input[type="password"]');
if (input){
    input.addEventListener("keydown", function(e) {
        if (e.code === "Space") {
            e.preventDefault();
        }
    });
}


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

const threadInput = document.querySelector('#thread-input');
const createThreadButton = document.querySelector('#create-thread-button');
if (threadInput && createThreadButton){
    createThreadButton.addEventListener('click', async (event) =>{
        let newThread = threadInput.value.trim();
        if (newThread  && newThread.length <= 50 ){
            threadInput.value = '';
            console.log(newThread);
            event.preventDefault(); 
            /* const thread = {
                threadTitle: newThread
            }
            await fetch(`api/thread/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(thread)
            }) */
        }
        else{
            errorMessage('Ошибка валидации! Пожалуйста, проверьте правильность заполнения поля.');
            event.preventDefault(); 
        }
    })
}


const username = document.querySelector('#username');
const password = document.querySelector('#userPassword');
const registratoinButton = document.querySelector('#registrationButton');
if (username && password && registratoinButton){
    registratoinButton.addEventListener('click', async (event) =>{
    let usernameString = username.value.trim();
    let passwordString = password.value.trim();
    console.log(usernameString, passwordString);
    if (usernameString && passwordString && usernameString.length <= 50 && passwordString.length <= 60 ){
        username.value = '';
        password.value = '';
        const usernameHeader = document.querySelector('#loggedUserId');
        usernameHeader.textContent = usernameString;
        await fetch(`api/auth/registration`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                username: usernameString,
                password: passwordString
            }) 
        }) 
    } else{
        errorMessage('Ошибка валидации! Пожалуйста, проверьте правильность заполнения полей.')
        event.preventDefault();
    }
})
}  


const loginUsername = document.querySelector('#loginUsername');
const loginPassword = document.querySelector('#loginPassword');
const loginButton = document.querySelector('#loginButton');
if (loginUsername && loginPassword && loginButton){
    loginButton.addEventListener('click', async (event) =>{
    let loginUsernameString = loginUsername.value.trim();
    let loginPasswordString = loginPassword.value.trim();
    console.log(loginUsernameString, loginPasswordString);
    if (loginUsernameString && loginPasswordString && loginUsernameString <= 50 && loginPasswordString.length <= 60 ){
        const usernameHeader = document.querySelector('#loggedUserId');
        usernameHeader.textContent = loginUsernameString;
        loginUsername.value = '';
        loginPassword.value = ''; 
        await fetch(`api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                username: loginUsernameString,
                password: loginPasswordString
            }) 
        })
    } else{
        errorMessage('Ошибка валидации! Пожалуйста, проверьте правильность заполнения полей.')
        event.preventDefault();
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
            errorMessage('Нельзя отправить пустое сообщение!');
            event.preventDefault();
        }
    })
}
