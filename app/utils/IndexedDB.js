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
        try {
            const existItems = await this.db[storeName]
                .where('content')
                .equalsIgnoreCase(data.content)
                .toArray();
            if (existItems.length) {
                return;
            }
            await this.db[storeName].add(data);
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * 获取所有记录
     * @param {*} storeName
     */
    async get(storeName) {
        try {
            const res = await this.db[storeName].toArray();
            return res.sort((a, b) => b.createTime - a.createTime);
        } catch (e) {
            return [];
        }
    }

    /**
     * 删除所有记录
     * @param {*} storeName
     */
    async delete(storeName) {
        try {
            await this.db[storeName].clear();
        } catch (e) {
            console.error(e);
        }
    }
}
