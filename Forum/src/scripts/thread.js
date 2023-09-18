import  message  from './modules/notification.js';
import spinDecorator from './modules/spinner.js';

const sendMessageButton = document.querySelector('#sendMessageButton');
const messageText = document.querySelector('#sendMessageText');
const fileInput = document.querySelector('#fileInput');
let elements = document.querySelectorAll("[name='msgTxt']");
const prevButton = document.querySelector('#previewButton');
const preview = document.querySelector('#preview');
const arrayContent = [];

function checkString(str) {
  const tegs = ['<div>', '</div>', '<button>', '</button>', '<script>', '</script>',
    '</script>', '<input>', '</input>', '<textarea>', '</textarea>', '<a>', '</a>',
    '<span>', '</span>', '<head>', '</head>', '<nav>', '</nav>', '<section>', '</section>',
    '<article>', '</article>', '<title>', '<body>', '</body>', '<html>', '</html>',
    '<link>', '</link>', '<template>', '</template>'];

  for (let i = 0; i < tegs.length; i++) {
    if (str.includes(tegs[i])) {
      return false;
    }
  }
  return true;
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const threadId = urlParams.get('id');

const messages = document.querySelector('#messages');
if (messages) {
  const limit = 10;
  let offset = 10;
  let flag = false;
  window.addEventListener('scroll', async () => {
    const documentHeight = document.body.scrollHeight;
    const cuttentScroll = window.scrollY + window.innerHeight;

    if (documentHeight - cuttentScroll <= 10 && !flag) {
      console.log(offset)
      flag = true;
      await fetch(
        `api/message/get?id=${threadId}&offset=${offset}&limit=${limit}`,
        {
          method: 'GET',
        },
      )
        .then((response) => response.text())
        .then((data) => {
          if (data.length > 0) {
            messages.insertAdjacentHTML('beforeend', data);
            flag = false;
            offset += 10;
          }
        });
      elements = document.querySelectorAll("[name='msgTxt']");
      const start = arrayContent.length;
      const end = elements.length;
      let i = start;
      for (start; i < end; i++) {
        arrayContent.push(elements[i].textContent);
      }
      for (let i = 0; i < elements.length; i++) {
        arrayContent[i];
        const newText = marked.parse(arrayContent[i], { headerIds: false, mangle: false });
        if (checkString(newText)) {

          elements[i].innerHTML = newText;
        } else {
          newText = newText.replace('<p>', '');
          newText = newText.replace('</p>', '');
          elements[i].innerText = newText;
        }
      }
    }
  });
}

prevButton.addEventListener('click', spinDecorator(() => {
  const image =  document.createElement('img');
  image.style.maxWidth = '100%';
  const reader = new FileReader();
  if (fileInput.files.length > 0) {
    console.log('file');
    reader.onload = function() {
      image.src = reader.result;
      preview.appendChild(image);
    };
    reader.readAsDataURL(fileInput.files[0]);
  }
  preview.innerHTML = marked.parse(messageText.value, { headerIds: false, mangle: false });
}));

for (let i = 0; i < elements.length; i++) {
  arrayContent.push(elements[i].textContent);
  let newText = marked.parse(arrayContent[i], { headerIds: false, mangle: false });
  if (checkString(newText)) {
    elements[i].innerHTML = newText;
  } else {
    newText = newText.replace('<p>', '');
    newText = newText.replace('</p>', '');
    elements[i].innerText = newText;
  }
}

if (sendMessageButton && messageText) {
  sendMessageButton.addEventListener('click', spinDecorator(async (event) => {
    const newMessage = messageText.value.trim();
    if (newMessage || fileInput.files.length > 0) {
      
      messageText.value = '';
      if (fileInput.files.length > 0) {
        if (fileInput.files[0].size > 500 * 1024) {
          message("Размер файла не должен превышать 500кб!", "notification");
          return;
        }
          if (!isImage(fileInput.files[0])) {
            message('Отправить можно только изображение!', 'notification');
          } else {
            await sendFile(newMessage, fileInput.files[0]);
          }
      } else {
        await sendFile(newMessage, fileInput.files[0]);
      }
    } else {
      message('Нельзя отправить пустое сообщение!', 'notification');
      event.preventDefault();
    }
  }));
}

function isImage(file) {
  const acceptedImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];
  return acceptedImageTypes.includes(file.type);
}

async function sendFile(message, fileContent) {
  const formData = new FormData();
  formData.append('threadId', threadId);
  formData.append('message', message);
  formData.append('file', fileContent);
  formData.append('test', 0);
  await fetch('api/message/newMsg', {
    method: 'POST',
    body: formData,
  }).then(() => {
    location.replace(`/thread?id=${threadId}`);
  });
}
