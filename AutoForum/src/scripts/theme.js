import { message } from "./modules/notification.js";


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const threadId = urlParams.get('id');
const sort = urlParams.get('sort')

switch (sort) {
    case 'asc':
        let sortASC = document.querySelector('#sortASC');
        sortASC.classList.remove('btn-secondary');
        sortASC.classList.add('btn-primary');
        sortASC.disabled = true;
        break;
    case 'desc':
        let sortDESC = document.querySelector('#sortDESC');
        sortDESC.classList.remove('btn-secondary');
        sortDESC.classList.add('btn-primary');
        sortDESC.disabled = true;
        break;
    case 'id':
        let sortID = document.querySelector('#sortID');
        sortID.classList.remove('btn-secondary');
        sortID.classList.add('btn-primary');
        sortID.disabled = true;
        break;
    default:
        let sortDefault = document.querySelector('#sortID');
        sortDefault.classList.remove('btn-secondary');
        sortDefault.classList.add('btn-primary');
        sortDefault.disabled = true;
        break;
}


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
            await fetch(`api/thread/get?id=${threadId}&offset=${offset}&limit=${limit}&sort=${sort}`, {
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
                body: JSON.stringify({
                    threadTitle: newThread,
                    threadId: threadId
                })
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


const sortID = document.querySelector('#sortID');
if (sortID){
    sortID.addEventListener('click', async (event) =>{
        const url = new URL(window.location.href);
        url.searchParams.set('sort', 'id');
        window.location.replace(url.toString());
    })
}

const sortASC = document.querySelector('#sortASC');
if (sortASC){
    sortASC.addEventListener('click', async (event) =>{
        const url = new URL(window.location.href);
        url.searchParams.set('sort', 'asc');
        window.location.replace(url.toString());
    })
}

const sortDESC = document.querySelector('#sortDESC');
if (sortDESC){
    sortDESC.addEventListener('click', async (event) => {
        const url = new URL(window.location.href);
        url.searchParams.set('sort', 'desc');
        window.location.replace(url.toString());
    })
}