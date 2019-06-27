const { clipboard } = require('electron');
const { EventEmitter } = require('events');

const clipboardEmitter = new EventEmitter();
let watcherId = null;
let previousText = clipboard.readText();
let previousImage = clipboard.readImage();

clipboard.on = (event, listener) => {
    clipboardEmitter.on(event, listener);
    return clipboard;
};

clipboard.once = (event, listener) => {
    clipboardEmitter.once(event, listener);
    return clipboard;
};

clipboard.off = (event, listener) => {
    if (listener) {
        clipboardEmitter.removeListener(event, listener);
    } else {
        clipboardEmitter.removeAllListeners(event);
    }
    return clipboard;
};

clipboard.startWatching = () => {
    if (!watcherId) {
        // todo 使用node-schedule来做定时任务
        watcherId = setInterval(() => {
            previousText = clipboard.readText();
            if (isDiffText(previousText, previousText)) {
                clipboardEmitter.emit('text-changed');
            }
            previousImage = clipboard.readImage();
            if (isDiffImage(previousImage, previousImage)) {
                clipboardEmitter.emit('image-changed');
            }
        }, 500);
    }
    return clipboard;
};

clipboard.stopWatching = () => {
    if (watcherId) {
        clearInterval(watcherId);
    }
    watcherId = null;
    return clipboard;
};

function isDiffText(str1, str2) {
    return str2 && str1 !== str2;
}

function isDiffImage(img1, img2) {
    return !img2.isEmpty() && img1.toDataURL() !== img2.toDataURL();
}

module.exports = clipboard;
