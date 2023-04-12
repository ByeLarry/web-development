const errorMessage = (error) => {
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
}


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
        let usernameString = threadInput.value.trim();
        if (usernameString  && usernameString.length <= 50 ){
            console.log(usernameString);
            event.preventDefault(); 
            /* const thread = {
                threadTitle: usernameString
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
    console.log(usernameString, password.value);
    if (usernameString && password.value && usernameString.length <= 50 && password.value.length <= 60 ){
        const usernameHeader = document.querySelector('#loggedUserId');
        usernameHeader.textContent = usernameString;
        await fetch(`api/auth/registration`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                username: usernameString,
                password: password.value
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
    let usernameString = loginUsername.value.trim();
    console.log(usernameString, loginPassword.value);
    loginButton.addEventListener('click', async (event) =>{
    if (usernameString && loginPassword.value && usernameString.length <= 50 && loginPassword.value.length <= 60 ){
        await fetch(`api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                username: usernameString,
                password: loginPassword.value
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
