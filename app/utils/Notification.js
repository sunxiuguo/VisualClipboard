/**
 * notifaction
 * example. showNotification({ title: '您刚刚复制了一串文本' });
 * @param {*} options
 */

export default function showNotification(options) {
    if (Notification.permission === 'granted') {
        executeNotication(options);
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(permission => {
            if (permission === 'granted') {
                executeNotication(options);
            }
        });
    }
}

function executeNotication(options) {
    const notication = new Notification(options.title, options);
    setTimeout(() => {
        notication.close();
    }, 2000);
}
