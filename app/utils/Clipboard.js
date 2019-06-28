import { clipboard } from 'electron';
import DataBase from './IndexedDB';

const Db = new DataBase();

export default class Clipboard {
    constructor() {
        this.watcherId = null;
        this.previousText = clipboard.readText();
        this.previousImage = clipboard.readImage();
    }

    startWatching = () => {
        if (!this.watcherId) {
            // todo 使用node-schedule来做定时任务
            this.watcherId = setInterval(() => {
                if (
                    Clipboard.isDiffText(
                        this.previousText,
                        clipboard.readText()
                    )
                ) {
                    this.previousText = clipboard.readText();
                    Db.add('text', {
                        createTime: Date.now(),
                        content: this.previousText
                    });
                }
                if (
                    Clipboard.isDiffImage(
                        this.previousImage,
                        clipboard.readImage()
                    )
                ) {
                    this.previousImage = clipboard.readImage();
                    Db.add('image', {
                        createTime: Date.now(),
                        content: this.previousImage
                    });
                }
            }, 500);
        }
        return clipboard;
    };

    stopWatching = () => {
        if (this.watcherId) {
            clearInterval(this.watcherId);
        }
        this.watcherId = null;
        return clipboard;
    };

    static isDiffText(str1, str2) {
        return str2 && str1 !== str2;
    }

    static isDiffImage(img1, img2) {
        return !img2.isEmpty() && img1.toDataURL() !== img2.toDataURL();
    }
}
