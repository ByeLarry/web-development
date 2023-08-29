import { message } from './modules/notification.js'

const input = document.querySelector('#oldPassword')
if (input) {
  input.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
      e.preventDefault()
    }
  })
}

const input2 = document.querySelector('#newPassword')
if (input2) {
  input2.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
      e.preventDefault()
    }
  })
}

const userExit = document.querySelector('#userExit')
if (userExit) {
  userExit.addEventListener('click', async (event) => {
    await fetch('api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        deleteCookie: true
      })
    })
    window.location.replace('http://localhost/')
  })
}

const noButton = document.querySelector('#no-button')
if (noButton) {
  noButton.addEventListener('click', async (event) => {
    message('Аккаунт не удален.', 'notification')
  })
}

const changePassword = document.querySelector('#changePassword')
const oldPassword = document.querySelector('#oldPassword')
const newPassword = document.querySelector('#newPassword')
if (changePassword && oldPassword && newPassword) {
  changePassword.addEventListener('click', async (event) => {
    const newPasswordString = newPassword.value.trim()
    const oldPasswordString = oldPassword.value.trim()
    if (newPasswordString && oldPasswordString && newPasswordString.length <= 60 && oldPasswordString.length <= 60) {
      oldPassword.value = ''
      newPassword.value = ''

      const encoder = new TextEncoder()
      const oldData = encoder.encode(oldPasswordString)
      const newData = encoder.encode(newPasswordString)
      const oldHash = await crypto.subtle.digest('SHA-256', oldData)
      const newHash = await crypto.subtle.digest('SHA-256', newData)
      const hashedOld = Array.from(new Uint8Array(oldHash)).map(b => b.toString(16).padStart(2, '0')).join('')
      const hashedNew = Array.from(new Uint8Array(newHash)).map(b => b.toString(16).padStart(2, '0')).join('')

      await fetch('api/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          oldPassword: hashedOld,
          newPassword: hashedNew
        })
      }).then(data => data.text())
        .then(response => {
          const isUpdate = JSON.parse(response)
          if (isUpdate.isUpdate === true) {
            message('Вы успешно изменили пароль', 'success')
            event.preventDefault()
          } else {
            message('Старый пароль введен некорректно!', 'notification')
            event.preventDefault()
          }
        })
    } else {
      message('Ошибка валидации! Пожалуйста, проверьте правильность заполнения полей.', 'notification')
      event.preventDefault()
    }
  })
}

const deleteUser = document.querySelector('#deleteUser')
if (deleteUser) {
  deleteUser.addEventListener('click', async (event) => {
    await fetch('api/user/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        deleteCookie: true
      })
    })
    window.location.replace('http://localhost/')
  })
}
