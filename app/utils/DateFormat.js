export default class DateFormat {
    static toTwoDigit(num) {
        return num < 10 ? `0${num}` : `${num}`;
    }

    static format(time, formation = 'YYYY-MM-DD HH:mm:ss') {
        return new DateFormat(time).format(formation);
    }

    constructor(time) {
        this.WEEK_NAMES = ['日', '一', '二', '三', '四', '五', '六'];
        if (typeof time === 'number') {
            this.date = new Date(time);
        } else {
            this.date = time;
        }
    }

    format(formation) {
        const thiz = this;
        return formation.replace(/Y+|M+|D+|d+|H+|h+|m+|s+/g, $0 => {
            const result = thiz[$0];
            return result === undefined ? $0 : result;
        });
    }

    get YY() {
        return this.YYYY.toString().slice(2);
    }

    get YYYY() {
        return this.date.getFullYear();
    }

    get M() {
        return this.date.getMonth() + 1;
    }

    get MM() {
        return DateFormat.toTwoDigit(this.M);
    }

    get d() {
        return this.date.getDay();
    }

    get dd() {
        return this.WEEK_NAMES[this.d];
    }

    get ddd() {
        return `周${this.dd}`;
    }

    get dddd() {
        return `星期${this.dd}`;
    }

    get D() {
        return this.date.getDate();
    }

    get DD() {
        return DateFormat.toTwoDigit(this.D);
    }

    get H() {
        return this.date.getHours();
    }

    get HH() {
        return DateFormat.toTwoDigit(this.H);
    }

    get h() {
        const h = this.H;
        return h > 12 ? h - 12 : h;
    }

    get hh() {
        return DateFormat.toTwoDigit(this.h);
    }

    get m() {
        return this.date.getMinutes();
    }

    get mm() {
        return DateFormat.toTwoDigit(this.m);
    }

    get s() {
        return this.date.getSeconds();
    }

    get ss() {
        return DateFormat.toTwoDigit(this.s);
    }
}
