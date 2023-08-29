import { message } from "./modules/notification.js";

document.addEventListener("keydown", function (event) {
  if (event.code === "Enter") {
    event.preventDefault();
    sendMessageButton.click();
  }
});

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const threadId = urlParams.get("id");

const messages = document.querySelector("#messages");
if (messages) {
  const limit = 10;
  let offset = 10;
  let flag = false;
  window.addEventListener("scroll", async (event) => {
    const documentHeight = document.body.scrollHeight;
    const cuttentScroll = window.scrollY + window.innerHeight;

    if (documentHeight - cuttentScroll <= 0 && !flag) {
      flag = true;
      await fetch(
        `api/message/get?id=${threadId}&offset=${offset}&limit=${limit}`,
        {
          method: "GET",
        }
      )
        .then((response) => response.text())
        .then((data) => {
          if (data.length > 0) {
            messages.insertAdjacentHTML("beforeend", data);
            flag = false;
            offset += 10;
          }
        });
    }
  });
}

const sendMessageButton = document.querySelector("#sendMessageButton");
const messageText = document.querySelector("#sendMessageText");
const fileInput = document.querySelector("#fileInput");
const elements = document.querySelectorAll("[name='msgTxt']");
const prevButton = document.querySelector("#previewButton");
const preview = document.querySelector("#preview");

prevButton.addEventListener("click", () => {
  preview.innerHTML = marked.parse(messageText.value, {headerIds: false, mangle: false});
})

for (let i = 0; i < elements.length; i++) {
  const newText = marked.parse(elements[i].textContent, {headerIds: false, mangle: false});
  elements[i].innerHTML = newText;
}

if (sendMessageButton && messageText) {
  sendMessageButton.addEventListener("click", async (event) => {
    const newMessage = messageText.value.trim();
    if (newMessage || fileInput.files.length > 0) {
      messageText.value = "";
      let fileContent = null;
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        if (file.size > 500 * 1024) {
          message("Размер файла не должен превышать 500кб!", "notification");
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(fileInput.files[0]);
        reader.onload = async () => {
          fileContent = reader.result;
          if (!isImage(fileInput.files[0])) {
            message("Отправить можно только изображение!", "notification");
          } else {
            await sendFile(newMessage, fileContent);
          }
        };
      } else {
        await sendFile(newMessage, fileContent);
      }
    } else {
      message("Нельзя отправить пустое сообщение!", "notification");
      event.preventDefault();
    }
  });
}

function isImage(file) {
  const acceptedImageTypes = ["image/jpg", "image/jpeg", "image/png"];
  return acceptedImageTypes.includes(file.type);
}

async function sendFile(message, fileContent) {
  await fetch("api/message/newMsg", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      threadId,
      message,
      file: fileContent,
    }),
  }).then(() => {
    location.replace(`/thread?id=${threadId}`);
  });
}
