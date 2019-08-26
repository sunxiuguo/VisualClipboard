import DataBase from './IndexedDB';

const { clipboard } = require('electron');
const schedule = require('node-schedule');

const Db = new DataBase();

export default class Clipboard {
    constructor() {
        this.watcherId = null;
        this.previousText = clipboard.readText();
        this.previousImage = clipboard.readImage();
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
        if (Clipboard.isDiffImage(this.previousImage, clipboard.readImage())) {
            this.previousImage = clipboard.readImage();
            if (this.previousImage) {
                Db.add('image', {
                    createTime: Date.now(),
                    content: this.previousImage.toDataURL(),
                    ratio: this.previousImage.getAspectRatio() // 图片长宽比
                });
            }
        }
    }

    static isDiffText(str1, str2) {
        return str2 && str1 !== str2;
    }

    static isDiffImage(preImage, currentImage) {
        if (!preImage) {
            return true;
        }
        return (
            !currentImage.isEmpty() &&
            preImage.toDataURL() !== currentImage.toDataURL()
        );
    }
}
