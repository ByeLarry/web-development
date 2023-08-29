import  message  from './modules/notification.js';
import  spinDecorator from './modules/spinner.js';

const limit = 20;
let offset = 20;
let flag = false;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const threadId = urlParams.get('id');
const sort = urlParams.get('sort');
const threadList = document.querySelector('#threadList');

const sortASC = document.querySelector('#sort-ASC');
const sortDESC = document.querySelector('#sort-DESC');
const sortID = document.querySelector('#sort-ID');

const dropdownButton = document.querySelector('.drop-button');



if (dropdownButton) {
  switch (sort) {
    case 'asc':
      dropdownButton.textContent = 'По возрастанию';
      break;
    case 'desc':
      dropdownButton.textContent = 'По убыванию';
      break;
    case 'id':
      dropdownButton.textContent = 'По порядку';
      break;
    default:
      dropdownButton.textContent = 'По порядку';
      break;
  }
}

const search = document.querySelector('#search');
document.querySelector('#search').oninput = spinDecorator(async () => {
  const val = search.value.trim();
  const allItems = document.querySelectorAll('.elastic li');
  allItems.forEach((elem) => {
    elem.remove();
  });
  await fetch(`api/thread/search?id=${threadId}&val=${val}&sort=${sort}`, {
    method: 'GET',
  }).then((response) => response.text())
    .then((data) => {
      if (data.length > 0) {
        threadList.insertAdjacentHTML('beforeend', data);
      }
    });

  const searchItems = document.querySelectorAll('.elastic li');
  await fetch(`api/thread/count?id=${threadId}`, {
    method: 'GET',
  }).then((response) => response.text())
    .then((data) => {
      offset = JSON.parse(data).count + 20;
    });
  if (val != '') {
    searchItems.forEach((elem) => {
      if (elem.innerText.search(val) == -1) {
        elem.classList.add('hide');
      } else {
        elem.classList.remove('hide');
      }
    });
  } else {
    searchItems.forEach((elem) => {
      elem.classList.remove('hide');
    });
  }
});

if (threadList) {
  window.addEventListener('scroll', async () => {
    const documentHeight = document.body.scrollHeight;
    const cuttentScroll = window.scrollY + window.innerHeight;

    if (documentHeight - cuttentScroll <= 0 && !flag) {
      flag = true;
      await fetch(`api/thread/get?id=${threadId}&offset=${offset}&limit=${limit}&sort=${sort}`, {
        method: 'GET',
      }).then((response) => response.text())
        .then((data) => {
          if (data.length > 0) {
            threadList.insertAdjacentHTML('beforeend', data);
            flag = false;
            offset += 20;
          }
        });
    }
  });
}


const threadInput = document.querySelector('#thread-input');
const createThreadButton = document.querySelector('#create-thread-button');
if (threadInput && createThreadButton) {
  createThreadButton.addEventListener('click', spinDecorator(async (event) => {
    const newThread = threadInput.value.trim();
    if (newThread && newThread.length <= 50) {
      threadInput.value = '';
      await fetch('api/thread/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          threadTitle: newThread,
          threadId: threadId,
          test: 0
        }),
      }).then((data) => data.text())
        .then((response) => {
          const isCreatedThread = JSON.parse(response);
          if (isCreatedThread.isCreatedThread === true) {
            message('Тема добавлена.', 'success');
            
          } else {
            message('Такая тема уже существует!', 'notification');
          }
        });
      } else {
        message('Ошибка валидации! Пожалуйста, проверьте правильность заполнения поля.', 'notification');
      }
  }));
}

if (sortID) {
  sortID.addEventListener('click', spinDecorator(async () => {
    document.querySelector('.spinner').style.display = 'block';
    const url = new URL(window.location.href);
    url.searchParams.set('sort', 'id');
    window.location.replace(url.toString());
    document.querySelector('.spinner').style.display = 'none';
  }));
}

if (sortASC) {
  sortASC.addEventListener('click', spinDecorator(async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('sort', 'asc');
    window.location.replace(url.toString());
  }));
}

if (sortDESC) {
  sortDESC.addEventListener('click', spinDecorator(async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('sort', 'desc');
    window.location.replace(url.toString());
  }));
}
