/**
 * Use Dexie
 */
const Dexie = require('dexie');
const { DereplicateArray } = require('./Utils');

export default class DataBase {
    constructor() {
        this.db = new Dexie('Clipboard-0.19.0');
        this.init();
    }

    init() {
        this.db.version(1).stores({
            text: '++id,createTime,content',
            image: '++id,createTime,content,contentLow',
            html: '++id,createTime,content'
        });
    }

    /**
     * 新增记录
     * @param {*} storeName 表名
     * @param {*} data 新增的记录
     */
    async add(storeName, data) {
        this.db.transaction('rw', this.db[storeName], async () => {
            const currentRecords = this.db[storeName]
                .where('content')
                .equalsIgnoreCase(data.content);
            const existItems = await currentRecords.toArray();
            if (existItems.length) {
                await currentRecords.modify({ createTime: data.createTime });
            } else {
                await this.db[storeName].add(data);
            }
        });
    }

    /**
     * 获取所有记录
     * @param {*} storeName
     */
    async get(storeName) {
        const res = await this.db.transaction('r', this.db[storeName], () =>
            this.db[storeName].toArray()
        );
        const sortedList = res.sort((a, b) => b.createTime - a.createTime);
        return DereplicateArray(sortedList, 'content');
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

    async deleteByTimestamp(storeName, expiredTime) {
        this.db.transaction('rw', this.db[storeName], async () => {
            await this.db[storeName]
                .where('createTime')
                .below(expiredTime)
                .delete();
        });
    }
}
