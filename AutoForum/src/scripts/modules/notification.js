export const message = (msg, classType) => {
    const notification = document.querySelector('.' + classType);
    if (notification) {
        notification.remove();
    }
    const newNotification = document.createElement('div');
    newNotification.textContent = msg;
    newNotification.classList.add(classType);
    document.body.appendChild(newNotification);
    newNotification.addEventListener('click', function() {
        newNotification.style.display = 'none';
    });
}