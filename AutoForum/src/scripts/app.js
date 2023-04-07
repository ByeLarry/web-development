const messages = document.querySelector('#messages');

if (messages){
    const limit = 10;
    let offset = 11;
    let flag = false;

    window.addEventListener('scroll', async (event) => {
        let documentHeight = document.body.scrollHeight;
        let cuttentScroll = window.scrollY + window.innerHeight  ;
        
        if (documentHeight - cuttentScroll  <= 0 && !flag) {
            flag = true;
            await fetch(`api/messages?id=1&offset=${offset}&limit=${limit}`, {
                method: 'GET'
            }).then(response => response.text())
                .then(data => {
                    if (data.length > 0) {
                        messages.insertAdjacentHTML('beforeend', data);
                        flag = false;
                        offset += 10;
                    }
                })
        }
    })
}

const threadInput = document.querySelector('#thread-input');
const createThreadButton = document.querySelector('#create-thread-button');
createThreadButton.addEventListener('click', async (event) =>{
    if (threadInput.value  && threadInput.value.length <= 50 ){
        console.log(threadInput.value);
        await fetch(`api/thread/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(threadInput.value)
        })
    }
})

/* document.getElementById("create-thread-button").addEventListener("click", function(event) {
    event.preventDefault(); // отменяем действие по умолчанию (отправку формы)
    var threadInput = document.getElementById("thread-input");
    var threadName = threadInput.value.trim(); // удаляем пробелы в начале и конце вводимой строки
    if (threadName.length === 0) {
      alert("Введите название темы");
    } else if (threadName.length > 50) {
      alert("Название темы не может быть длиннее 50 символов");
    } else {
      // обрабатываем создание новой темы
      // ...
    }
  }); */
  

