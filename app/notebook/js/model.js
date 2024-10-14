"use strict";

const levels = new Map([
    ["text", 0],
    ["link", 1],
    ["info", 2],
    ["primary", 3],
    ["success", 4],
    ["warning", 5],
    ["danger", 6],
])

class Note {
    constructor(title, color, text, date) {
        this.title = title;
        this.color = color;
        this.text = text;
        if (date) {
            this.date = date;
        } else {
            this.date = new Date(Date.now()).toLocaleString();
        }
    }
}


class Subject {
    constructor() {
        this.handlers = [];
    }

    subscribe(fn) {
        this.handlers.push(fn);
    }

    unsubscribe(fn) {
        this.handlers = this.handlers.filter(
            function (item) {
                if (item !== fn) {
                    return item;
                }
            }
        );
    }

    publish(someObj, msg) {
        var scope = someObj || window;
        for (let fn of this.handlers) {
            fn(scope, msg);
        }
    }
}


class Notebook extends Subject {
    constructor() {
        super();
        this.notes = [];
    }

    add(note) {
        this.notes.push(note);
        this.publish(this, "Note taken");
    }

    update() {
        this.publish(this, "Note updated");
    }

    remove(note) {
        this.notes = this.notes.filter(
            function (item) {
                if (item !== note) {
                    return item;
                }
            }
        );
        this.publish(this, "Note removed");
    }

    [Symbol.iterator]() {
        this.notes.sort(function (note1, note2) { return levels.get(note2.color) - levels.get(note1.color); });
        let idx = -1;
        return {
            next: () => ({ value: this.notes[++idx], done: !(idx in this.notes) })
        };
    }
}


class LocalStorageSaver {
    constructor() {
        this.storage = window.localStorage;
    }
}
