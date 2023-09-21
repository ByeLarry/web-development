import  message  from './modules/notification.js';
import spinDecorator from './modules/spinner.js';

const input = document.querySelector('#oldPassword');
if (input) {
  input.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
    }
  });
}

const input2 = document.querySelector('#newPassword');
if (input2) {
  input2.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
    }
  });
}

const userExit = document.querySelector('#user-logout');
if (userExit) {
  userExit.addEventListener('click', spinDecorator(async (event) => {
    await fetch('api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        deleteCookie: true,
        test: 0
      }),
    });
    window.location.replace('http://localhost/');
  }));
}

const userPopup = document.querySelector('#userPopup');
const changePasswordButton = document.querySelector('#changePasswordButton');
const deleteAccountButton = document.querySelector('#deleteAccountButton');
if (changePasswordButton) {
  changePasswordButton.addEventListener('click', spinDecorator(async (event) => {
    const check = document.querySelector('.insert');
    if (check) {
      check.remove();
    }
    const newOldPassword = document.createElement('input');
    const newNewPassword = document.createElement('input');
    const newButton = document.createElement('button');
    const clearButton = document.createElement('button');
    clearButton.id = 'clearPopup';
    clearButton.textContent = 'Отмена';
    clearButton.classList.add('btn');
    clearButton.classList.add('btn-primary');
    clearButton.type = 'button';
    newOldPassword.placeholder = 'Введите старый пароль';
    newNewPassword.placeholder = 'Введите новый пароль';
    newButton.textContent = 'Изменить';
    newOldPassword.id = 'oldPassword';
    newNewPassword.id = 'newPassword';
    newButton.id = 'changePassword';
    newButton.classList.add('btn');
    newButton.classList.add('btn-dark');
    newOldPassword.type = 'password';
    newNewPassword.type = 'password';
    newButton.type = 'button';
    newButton.setAttribute('data-dismiss', 'modal');
    newOldPassword.classList.add('form-control');
    newNewPassword.classList.add('form-control');
    const newDiv = document.createElement('div');
    newDiv.classList.add('insert');
    newDiv.append(newOldPassword, newNewPassword, newButton, clearButton);
    userPopup.append(newDiv);
    const clearPopup = document.querySelector('#clearPopup');
    if (clearPopup) {
      clearPopup.addEventListener('click', async (event) => {
        document.querySelector('.insert').remove();
      });
    }
    const change = document.querySelector('#changePassword');
    if (change) {
      change.addEventListener('click', async (event) => {
        const newPasswordString = newNewPassword.value.trim();
        const oldPasswordString = newOldPassword.value.trim();
        if (newPasswordString && oldPasswordString && newPasswordString.length <= 60 && oldPasswordString.length <= 60) {
          newOldPassword.value = '';
          newNewPassword.value = '';

          const encoder = new TextEncoder();
          const oldData = encoder.encode(oldPasswordString);
          const newData = encoder.encode(newPasswordString);
          const oldHash = await crypto.subtle.digest('SHA-256', oldData);
          const newHash = await crypto.subtle.digest('SHA-256', newData);
          const hashedOld = Array.from(new Uint8Array(oldHash)).map((b) => b.toString(16).padStart(2, '0')).join('');
          const hashedNew = Array.from(new Uint8Array(newHash)).map((b) => b.toString(16).padStart(2, '0')).join('');

          await fetch('api/user/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
              oldPassword: hashedOld,
              newPassword: hashedNew,
              test: 0
            }),
          }).then((data) => data.text())
            .then((response) => {
              const isUpdate = JSON.parse(response);
              if (isUpdate.isUpdate === true) {
                message('Вы успешно изменили пароль', 'success');
                event.preventDefault();
              } else {
                message('Старый пароль введен некорректно!', 'notification');
                event.preventDefault();
              }
            });
        } else {
          message('Ошибка валидации! Пожалуйста, проверьте правильность заполнения полей.', 'notification');
          event.preventDefault();
        }
      });
    }
  }));
}

if (deleteAccountButton) {
  deleteAccountButton.addEventListener('click', spinDecorator(async (event) => {
    const check = document.querySelector('.insert');
    if (check) {
      check.remove();
    }
    const deleteAccount = document.createElement('button');
    const deleteText = document.createElement('h4');
    const clearButton = document.createElement('button');
    clearButton.id = 'clearPopup';
    clearButton.textContent = 'Отмена';
    clearButton.classList.add('btn');
    clearButton.classList.add('btn-primary');
    clearButton.type = 'button';
    deleteText.textContent = 'Вы уверены что хотите удалить аккаунт?';
    deleteAccount.textContent = 'Да';
    deleteAccount.id = 'deleteUser';
    deleteAccount.classList.add('btn');
    deleteAccount.classList.add('btn-danger');
    deleteAccount.type = 'button';
    const newDiv = document.createElement('div');
    newDiv.classList.add('insert');
    newDiv.append(deleteText, deleteAccount, clearButton);
    userPopup.append(newDiv);
    const clearPopup = document.querySelector('#clearPopup');
    if (clearPopup) {
      clearPopup.addEventListener('click', async (event) => {
        document.querySelector('.insert').remove();
      });
    }
    const deleteUser = document.querySelector('#deleteUser');
    if (deleteUser) {
      deleteUser.addEventListener('click', async (event) => {
        await fetch('api/user/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
            deleteCookie: true,
            test: 0
          }),
        });
        window.location.replace('http://localhost/');
      });
    }
  }));
}


const userThreads = document.querySelector('#userThreads');
if (userThreads) {
  userThreads.addEventListener('click', spinDecorator(async (event) => {
    await fetch('api/user/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    }).then((data) => data.text())
      .then((response) => {
        const objects = JSON.parse(response);
        if (document.querySelectorAll('.user-threads').length > 0) {
          document.querySelectorAll('.user-threads').forEach(element => {
            element.remove();
          });
        } else {
          for (let i = 0; i < objects.length; i++) {
            const thread = document.createElement('a');
            thread.textContent = objects[i].title;
            thread.className = 'user-threads';
            thread.title, thread.href = `http://localhost/thread?id=${objects[i].id}`
            document.querySelector('.user-threads-div').appendChild(thread);
          }
        }
      });
  }));
}