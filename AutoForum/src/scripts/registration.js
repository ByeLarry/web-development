import { message } from "./modules/notification.js";


const input = document.querySelector('input[type="password"]');
if (input){
    input.addEventListener("keydown", function(e) {
        if (e.code === "Space") {
            e.preventDefault();
        }
    });
}




const username = document.querySelector('#username');
const password = document.querySelector('#userPassword');
const registratoinButton = document.querySelector('#registrationButton');
if (username && password && registratoinButton){
    registratoinButton.addEventListener('click', async (event) =>{
    let usernameString = username.value.trim();
    let passwordString = password.value.trim();
    if (usernameString && passwordString && usernameString.length <= 50 && passwordString.length <= 60 ){
        username.value = '';
        password.value = '';

        const encoder = new TextEncoder();
        const data = encoder.encode(passwordString);
        const hash = await crypto.subtle.digest('SHA-256', data);
        const hashedPassword = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
        
        await fetch(`api/auth/registration`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                username: usernameString,
                password: hashedPassword
            })
        }).then(data => data.text())
        .then(response => {
            const isAuthorized = JSON.parse(response)
            if (isAuthorized.isAuthorized === true){
                window.location.replace('home');
            }else{
                message('Выбранное имя уже существует!', 'notification');
                event.preventDefault();
            }
        });
    } else{
        message('Ошибка валидации! Пожалуйста, проверьте правильность заполнения полей.', 'notification');
        event.preventDefault();
    }
})
}