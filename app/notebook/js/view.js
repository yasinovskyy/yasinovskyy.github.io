"use strict";


class NotebookView {
    constructor(model) {
        model.subscribe(this.redrawList.bind(this));
    }

    redrawList(notebook, msg) {
        let allNotes = document.querySelector("#allNotes");
        allNotes.innerHTML = "";
        for (let note of notebook) {
            this.addNote(note, allNotes);
        }
    }

    addNote(note, parent) {
        let cell = document.createElement("div");
        cell.classList = "cell is-fullwidth is-fullheight";
        let rows = Math.floor(note.text.length / 50);
        if (rows > 0) { cell.classList.add(`is-row-span-${rows}`) }

        let msg = document.createElement("article");
        msg.classList = `message is-fullwidth is-fullheight is-${note.color} note`;

        let msgHead = document.createElement("div");
        msgHead.classList.add("message-header");
        let msgTitle = document.createElement("p");
        msgTitle.innerHTML = note.title;
        msgHead.appendChild(msgTitle);
        let btnDelete = document.createElement("button");
        btnDelete.classList = "delete deleteNote";
        btnDelete.ariaLabel = "delete";
        btnDelete.onclick = function () { removeNote(note); };
        msgHead.appendChild(btnDelete);
        msg.appendChild(msgHead);

        let msgBody = document.createElement("div");
        msgBody.classList.add("message-body");
        msgBody.innerHTML = note.text;
        msgBody.innerHTML += `<p class="has-text-right is-size-7"><em>${note.date}</em></p>`;

        let btnEdit = document.createElement("button");
        btnEdit.title = "Edit note";
        btnEdit.classList = "editNote";
        btnEdit.ariaLabel = "edit";
        btnEdit.onclick = function () { editNote(note); };
        let iconEdit = document.createElement("ion-icon");
        iconEdit.setAttribute("name", "create-outline");
        btnEdit.appendChild(iconEdit);
        msgBody.appendChild(btnEdit);

        let btnColorUp = document.createElement("button");
        btnColorUp.title = "Towards danger";
        btnColorUp.onclick = function () { colorUpNote(note); };
        let iconColorUp = document.createElement("ion-icon");
        iconColorUp.setAttribute("name", "arrow-up-outline");
        btnColorUp.appendChild(iconColorUp);
        msgBody.appendChild(btnColorUp);

        let btnColorDown = document.createElement("button");
        btnColorDown.title = "Away from danger";
        btnColorDown.onclick = function () { colorDownNote(note); };
        let iconColorDown = document.createElement("ion-icon");
        iconColorDown.setAttribute("name", "arrow-down-outline");
        btnColorDown.appendChild(iconColorDown);
        msgBody.appendChild(btnColorDown);

        let btnRemove = document.createElement("button");
        btnRemove.title = "Delete note";
        btnRemove.classList = "deleteNote";
        btnRemove.ariaLabel = "delete";
        btnRemove.onclick = function () { removeNote(note); };
        let iconRemove = document.createElement("ion-icon");
        iconRemove.setAttribute("name", "trash-outline");
        btnRemove.appendChild(iconRemove);
        msgBody.appendChild(btnRemove);

        msg.appendChild(msgBody);
        cell.appendChild(msg)
        parent.appendChild(cell);
    }
}
