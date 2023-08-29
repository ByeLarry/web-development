export function spinDecorator(func) {
    return async function (...args) {
        document.querySelector('.spinner').style.display = 'block';
        const result = await func(...args);
        document.querySelector('.spinner').style.display = 'none';
        return result;
    }
}

export default spinDecorator;