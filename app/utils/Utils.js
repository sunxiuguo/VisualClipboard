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

// 对象数组去重
export function DereplicateArray(array, uniqueKey) {
    const map = {};
    return array.reduce((item, next) => {
        if (!map[next[uniqueKey]]) {
            map[next[uniqueKey]] = true;
            item.push(next);
        }
        return item;
    }, []);
}
