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
