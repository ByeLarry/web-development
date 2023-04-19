import { message } from "./modules/notification.js";

const threadInput = document.querySelector('#thread-input');
const createThreadButton = document.querySelector('#create-thread-button');
if (threadInput && createThreadButton){
    createThreadButton.addEventListener('click', async (event) =>{
        let newThread = threadInput.value.trim();
        if (newThread  && newThread.length <= 50 ){
            threadInput.value = '';
            message('Тема добавлена.', 'success');
            event.preventDefault(); 
            const thread = {
                threadTitle: newThread
            }
            await fetch(`api/thread/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(thread)
            }) 
        }
        else{
            message('Ошибка валидации! Пожалуйста, проверьте правильность заполнения поля.', 'notification');
            event.preventDefault(); 
        }
    })
}