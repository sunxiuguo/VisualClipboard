import DataBase from './IndexedDB';

const { clipboard } = require('electron');
const schedule = require('node-schedule');
const md5 = require('md5');
const fs = require('fs');

const Db = new DataBase();
const hostPath = `${__dirname}/temp`;

function xMkdirSync(dirname) {
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname);
    }
}

xMkdirSync(hostPath);

export default class Clipboard {
    constructor() {
        this.watcherId = null;
        this.previousText = clipboard.readText();
        this.previousImageMd5 = md5(clipboard.readImage().toPNG());
    }

    startWatching = () => {
        if (!this.watcherId) {
            this.watcherId = schedule.scheduleJob('* * * * * *', () => {
                Clipboard.writeText();
                Clipboard.writeImage();
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
        const pngBuffer = nativeImage.toPNG();
        const md5String = md5(pngBuffer);

        if (Clipboard.isDiffText(this.previousImageMd5, md5String)) {
            this.previousImageMd5 = md5String;
            if (!nativeImage.isEmpty()) {
                const path = `${hostPath}/${md5String}.png`;
                fs.writeFile(path, pngBuffer, err => {
                    if (!err) {
                        Db.add('image', {
                            createTime: Date.now(),
                            content: path
                        });
                    } else {
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
