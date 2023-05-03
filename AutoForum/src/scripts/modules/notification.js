export const message = (msg, classType) => {
    const notification = document.querySelector('.' + classType);
    if (document.querySelector('.notification')) {
        document.querySelector('.notification').remove();
    }
    if (document.querySelector('.success')) {
        document.querySelector('.success').remove();
    }
    const newNotification = document.createElement('div');
    newNotification.textContent = msg;
    newNotification.classList.add(classType);
    document.body.appendChild(newNotification);
    newNotification.addEventListener('click', function() {
        newNotification.style.display = 'none';
    });
    setTimeout(function() {
        newNotification.style.display = 'none';
    }, 3000);
}