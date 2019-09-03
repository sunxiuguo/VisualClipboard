import DataBase from './IndexedDB';
import DateFormat from './DateFormat';

const { clipboard } = require('electron');
const schedule = require('node-schedule');
const md5 = require('md5');
const fs = require('fs');
const rimraf = require('rimraf');

const Db = new DataBase();
const hostPath = `${__dirname}/temp`;
const jpegQualityLow = 1;
const jpegQualityHigh = 30;

function xMkdirSync(dirname) {
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname);
    }
}

xMkdirSync(hostPath);

export default class Clipboard {
    constructor() {
        this.watcherId = null;
        this.deleteSchedule = null;
        this.previousText = clipboard.readText();
        this.previousImageMd5 = md5(
            clipboard.readImage().toJPEG(jpegQualityHigh)
        );
    }

    startWatching = () => {
        if (!this.watcherId) {
            this.watcherId = schedule.scheduleJob('* * * * * *', () => {
                Clipboard.writeText();
                Clipboard.writeImage();
            });
        }
        if (!this.deleteSchedule) {
            this.deleteSchedule = schedule.scheduleJob('* * 1 * * *', () => {
                Clipboard.deleteExpiredRecords();
            });
        }
        return clipboard;
    };

    stopWatching = () => {
        if (this.watcherId) {
            this.watcherId.cancel();
        }
        this.watcherId = null;
        return clipboard;
    };

    static deleteExpiredRecords() {
        const now = Date.now();
        const expiredTimeStamp = now - 1000 * 60 * 60 * 24 * 7;
        // delete record in indexDB
        Db.deleteByTimestamp('text', expiredTimeStamp);
        Db.deleteByTimestamp('image', expiredTimeStamp);

        // remove jpg with fs
        const dateDirs = fs.readdirSync(hostPath);
        dateDirs.forEach(dirName => {
            if (
                Number(dirName) <=
                Number(DateFormat.format(expiredTimeStamp, 'YYYYMMDD'))
            ) {
                rimraf(`${hostPath}/${dirName}`, error => {
                    if (error) {
                        console.error(error);
                    }
                });
            }
        });
    }

    static deleteSavedImage() {}

    static writeText() {
        if (Clipboard.isDiffText(this.previousText, clipboard.readText())) {
            this.previousText = clipboard.readText();
            Db.add('text', {
                createTime: Date.now(),
                content: this.previousText
            });
        }
    }

    static writeImage() {
        const nativeImage = clipboard.readImage();
        const jpegBuffer = nativeImage.toJPEG(jpegQualityHigh);
        const md5String = md5(jpegBuffer);

        const jpegBufferLow = nativeImage.toJPEG(jpegQualityLow);
        const md5StringLow = md5(jpegBufferLow);

        if (Clipboard.isDiffText(this.previousImageMd5, md5String)) {
            this.previousImageMd5 = md5String;
            if (!nativeImage.isEmpty()) {
                const now = Date.now();
                const pathByDate = `${hostPath}/${DateFormat.format(
                    now,
                    'YYYYMMDD'
                )}`;
                xMkdirSync(pathByDate);
                const path = `${pathByDate}/${md5String}.jpeg`;
                const pathLow = `${pathByDate}/${md5StringLow}.jpeg`;
                fs.writeFileSync(pathLow, jpegBufferLow);

                Db.add('image', {
                    createTime: now,
                    content: path,
                    contentLow: pathLow
                });
                fs.writeFile(path, jpegBuffer, err => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        }
    }

    static isDiffText(str1, str2) {
        return str2 && str1 !== str2;
    }
}
