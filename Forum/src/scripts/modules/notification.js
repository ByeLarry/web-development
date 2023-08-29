export const message = (msg, classType) => {
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
  newNotification.addEventListener('click', () => {
    newNotification.style.display = 'none';
  });
  setTimeout(() => {
    newNotification.style.display = 'none';
  }, 5000);
};

export default message;
