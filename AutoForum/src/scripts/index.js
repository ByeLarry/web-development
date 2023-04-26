import { message } from "./modules/notification.js";


const threadList = document.querySelector('#threadList');
if (threadList){
    const limit = 20;
    let offset = 20;
    let flag = false;
    window.addEventListener('scroll', async (event) => {
        let documentHeight = document.body.scrollHeight;
        let cuttentScroll = window.scrollY + window.innerHeight  ;
        
        if (documentHeight - cuttentScroll  <= 0 && !flag) {
            flag = true;
            await fetch(`api/thread/get?offset=${offset}&limit=${limit}`, {
                method: 'GET',
            }).then(response => response.text())
                .then(data => {
                    if (data.length > 0) {
                        threadList.insertAdjacentHTML('beforeend', data);
                        flag = false;
                        offset += 20;
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
            const thread = {
                threadTitle: newThread
            }
            await fetch(`api/thread/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(thread)
            }).then(data => data.text())
            .then(response => {
                const isCreatedThread = JSON.parse(response);
                if (isCreatedThread.isCreatedThread == true){
                    message('Тема добавлена.', 'success');
                }else{
                    message('Такая тема уже существует!', 'notification');
                }
            }) 
        }
        else{
            message('Ошибка валидации! Пожалуйста, проверьте правильность заполнения поля.', 'notification');
        }
        event.preventDefault();
    })
}