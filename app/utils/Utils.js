export default function DateFormat(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month =
        date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const seconds =
        date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

    return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
}
