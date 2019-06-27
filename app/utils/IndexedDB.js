/**
 * Use Dexie
 */
const Dexie = require('dexie');

export default class DataBase {
    constructor() {
        this.db = new Dexie('Clipboard');
        this.init();
    }

    init() {
        this.db.version(1).stores({
            text: '++id,createTime,content',
            image: '++id,createTime,content',
            html: '++id,createTime,content'
        });
    }

    /**
     * 新增记录
     * @param {*} storeName 表名
     * @param {*} data 新增的记录
     */
    async add(storeName, data) {
        // 需要去重
        await this.db[storeName].add(data);
        return this.get(storeName);
    }

    /**
     * 获取所有记录
     * @param {*} storeName
     */
    async get(storeName) {
        return this.db[storeName].toArray();
    }

    /**
     * 删除所有记录
     * @param {*} storeName
     */
    async delete(storeName) {
        await this.db[storeName].clear();
        return this.get(storeName);
    }
}
