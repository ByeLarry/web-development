import  message from './modules/notification.js';
import spinDecorator from './modules/spinner.js';


const username = document.querySelector('#username');
const password = document.querySelector('#userPassword');
const confirmPassword = document.querySelector('#userPasswordConfirm');
const registratoinButton = document.querySelector('#registrationButton');

const input = document.querySelector('#userPassword');
if (input) {
  input.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
    }
  });
}

const input2 = document.querySelector('#userPasswordConfirm');
if (input2) {
  input2.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (username && password && confirmPassword && event.code === 'Enter' 
  && username.value !== '' && password.value !== '' 
  && confirmPassword.value !== '') {
    event.preventDefault();
    registratoinButton.click();
  }
});

if (username && password && registratoinButton && confirmPassword) {
  registratoinButton.addEventListener('click', spinDecorator(async (event) => {
    const usernameString = username.value.trim();
    const passwordString = password.value.trim();
    const confirmPasswordString = confirmPassword.value.trim();
    username.value = '';
    password.value = '';
    confirmPassword.value = '';
    if (
      usernameString
      && passwordString
      && usernameString.length <= 50
      && passwordString.length <= 60
      && confirmPasswordString === passwordString
    ) {
      const encoder = new TextEncoder();
      const data = encoder.encode(passwordString);
      const hash = await crypto.subtle.digest('SHA-256', data);
      const hashedPassword = Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      await fetch('api/auth/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          username: usernameString,
          password: hashedPassword,
          test: 0
        }),
      })
        .then((responseData) => responseData.text())
        .then((response) => {
          const isAuthorized = JSON.parse(response);
          if (isAuthorized.isAuthorized === true) {
            window.location.replace('http://localhost/');
          } else {
            message('Выбранное имя уже существует!', 'notification');
            event.preventDefault();
          }
        });
    } else {
      message(
        'Ошибка валидации! Пожалуйста, проверьте правильность заполнения полей.',
        'notification',
      );
      event.preventDefault();
    }
  }));
}