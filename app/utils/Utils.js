export default function DateFormat(timestamp, onlyDate = false) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month =
        date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    const minute =
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const seconds =
        date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    const dateString = `${year}-${month}-${day}`;
    if (onlyDate) {
        return dateString;
    }
    return `${dateString} ${hour}:${minute}:${seconds}`;
}

export function compareDate(time1, time2) {
    const date1 = DateFormat(time1, true);
    const date2 = DateFormat(time2, true);

    return date1 === date2;
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
