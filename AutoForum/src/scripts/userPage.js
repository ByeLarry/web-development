import { message } from "./modules/notification.js";

const input = document.querySelector('input[type="password"]');
if (input){
    input.addEventListener("keydown", function(e) {
        if (e.code === "Space") {
            e.preventDefault();
        }
    });
}




const userExit = document.querySelector('#userExit');
if (userExit){
    userExit.addEventListener('click', async (event) =>{

        await fetch(`api/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                deleteCookie: true,
            })
        });
        window.location.replace('home');
    })
}