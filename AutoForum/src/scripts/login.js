import { message } from './modules/notification.js'

const input = document.querySelector('#loginPassword')
if (input) {
  input.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
      e.preventDefault()
    }
  })
}

document.addEventListener('keydown', function (event) {
  if (event.code === 'Enter') {
    event.preventDefault()
    loginButton.click()
  }
})

const loginUsername = document.querySelector('#loginUsername')
const loginPassword = document.querySelector('#loginPassword')
const loginButton = document.querySelector('#loginButton')
if (loginUsername && loginPassword && loginButton) {
  loginButton.addEventListener('click', async (event) => {
    const loginUsernameString = loginUsername.value.trim()
    const loginPasswordString = loginPassword.value.trim()
    if (loginUsernameString && loginPasswordString && loginUsernameString.length <= 50 && loginPasswordString.length <= 60) {
      loginUsername.value = ''
      loginPassword.value = ''

      const encoder = new TextEncoder()
      const data = encoder.encode(loginPasswordString)
      const hash = await crypto.subtle.digest('SHA-256', data)
      const hashedPassword = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')

      await fetch('api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          username: loginUsernameString,
          password: hashedPassword
        })
      }).then(data => data.text())
        .then(response => {
          const isAuthorized = JSON.parse(response)
          if (isAuthorized.isAuthorized === false) {
            message('Нет такого пользователя!', 'notification')
            event.preventDefault()
          } else {
            window.location.replace('http://localhost/')
          }
        })
    } else {
      message('Ошибка валидации! Пожалуйста, проверьте правильность заполнения полей.', 'notification')
      event.preventDefault()
    }
  })
}
