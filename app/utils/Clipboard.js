import DataBase from './IndexedDB';

const { clipboard } = require('electron');
const schedule = require('node-schedule');
const md5 = require('md5');
const fs = require('fs');

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
        const jpegBuffer = nativeImage.toJPEG(jpegQualityHigh);
        const md5String = md5(jpegBuffer);

        const jpegBufferLow = nativeImage.toJPEG(jpegQualityLow);
        const md5StringLow = md5(jpegBufferLow);

        if (Clipboard.isDiffText(this.previousImageMd5, md5String)) {
            this.previousImageMd5 = md5String;
            if (!nativeImage.isEmpty()) {
                const path = `${hostPath}/${md5String}.jpeg`;
                const pathLow = `${hostPath}/${md5StringLow}.jpeg`;
                fs.writeFileSync(path, jpegBuffer);
                fs.writeFileSync(pathLow, jpegBufferLow);

                Db.add('image', {
                    createTime: Date.now(),
                    content: path,
                    contentLow: pathLow
                });
            }
        }
    }

    static isDiffText(str1, str2) {
        return str2 && str1 !== str2;
    }
}
