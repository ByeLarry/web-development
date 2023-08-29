import  message  from './modules/notification.js';
import spinDecorator from './modules/spinner.js';


const loginUsername = document.querySelector('#loginUsername');
const loginPassword = document.querySelector('#loginPassword');
const loginButton = document.querySelector('#loginButton');

const input = document.querySelector('#loginPassword');
if (input) {
  input.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (loginUsername && loginPassword && loginButton 
    && event.code === 'Enter' && loginPassword.value !== '' 
    && loginUsername.value !== '') {
    event.preventDefault();
    loginButton.click();
  }
});

if (loginUsername && loginPassword && loginButton) {
  loginButton.addEventListener('click', spinDecorator(async (event) => {
    const loginUsernameString = loginUsername.value.trim();
    const loginPasswordString = loginPassword.value.trim();
    if (loginUsernameString && loginPasswordString
      && loginUsernameString.length <= 50 && loginPasswordString.length <= 60) {
      loginUsername.value = '';
      loginPassword.value = '';

      const encoder = new TextEncoder();
      const data = encoder.encode(loginPasswordString);
      const hash = await crypto.subtle.digest('SHA-256', data);
      const hashedPassword = Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');

      await fetch('api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          username: loginUsernameString,
          password: hashedPassword,
          test: 0
        }),
      }).then((responseData) => responseData.text())
        .then((response) => {
          const isAuthorized = JSON.parse(response);
          if (isAuthorized.isAuthorized === false) {
            message('Нет пользователя с таким логином и паролем!', 'notification');
            event.preventDefault();
          } else {
            window.location.replace('http://localhost/');
          }
        });
    } else {
      message('Ошибка валидации! Пожалуйста, проверьте правильность заполнения полей.', 'notification');
      event.preventDefault();
    }
  }));
}
