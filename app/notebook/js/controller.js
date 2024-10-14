"use strict";

var notebookModel = new Notebook();
var notebookView = new NotebookView(notebookModel);
var myDB = new LocalStorageSaver();

/**
 * Populate select element with options from the collection
 * @param {*} element 
 * @param {*} collection 
 */
function populateSelect(element, collection) {
    let selectElement = document.querySelector(element);
    collection.entries().forEach(([key, value]) => {
        let opt = document.createElement("option");
        opt.value = key;
        opt.innerHTML = key[0].toUpperCase() + key.slice(1);
        selectElement.appendChild(opt);
    });
}

/**
 * Resets form to its initial status
 */
function resetForm() {
    document.querySelector("#title").value = "";
    document.querySelector("#color").selectedIndex = 0;
    document.querySelector("#text").value = "";
    document.querySelector("#text").classList = "textarea";
    document.querySelectorAll("[required]").forEach((f) => {
        f.classList.remove("is-danger");
        f.parentNode.parentNode.querySelector("p").classList.add("is-hidden");
    });
    document.querySelector("#addNote").innerHTML = "Add";
    document.querySelector("#addNote").onclick = function () { addNote() }
}

/**
 * Loads notes from local storage
 */
function populateNotes() {
    let notebook = JSON.parse(myDB.storage.getItem("notebook")) || [];
    if (notebookModel.notes.length == 0) {
        for (let storedNote of notebook) {
            let note = new Note(storedNote.title, storedNote.color, storedNote.text, storedNote.date);
            notebookModel.add(note);
        }
    }
}

/**
 * Saves notes to local storage
 */
function saveNotes() {
    myDB.storage.setItem("notebook", JSON.stringify(notebookModel.notes));
}

/**
 * Changes note color on color selection change
 */
function noteColor() {
    let color = document.querySelector("#color").value;
    let textField = document.querySelector("#text");
    textField.classList = `textarea has-background-${color}-light`;
}

/**
 * Adds or updates a note
 * @param {*} note 
 * @returns 
 */
function addNote(note) {
    let validForm = true;
    document.querySelectorAll("[required]").forEach((f) => {
        if (!f.checkValidity()) {
            f.classList.add("is-danger");
            f.parentNode.parentNode.querySelector("p").classList.remove("is-hidden")
            validForm = false;
        }
    });
    if (!validForm) { return; }

    let title = document.querySelector("#title").value;
    let color = document.querySelector("#color").value;
    let text = document.querySelector("#text").value;
    if (note == null) {
        let note = new Note(title, color, text);
        notebookModel.add(note);
    } else {
        note.title = title;
        note.color = color;
        note.text = text;
        notebookModel.update();
    }
    resetForm();
    saveNotes();
}

/**
 * Loads note properties into the form for editing
 * @param {*} note 
 */
function editNote(note) {
    document.querySelector("#title").value = note.title;
    document.querySelector("#color").selectedIndex = levels.get(note.color);
    document.querySelector("#color").onchange();
    document.querySelector("#text").value = note.text;
    document.querySelector("#addNote").innerHTML = "Update";
    document.querySelector("#addNote").onclick = function () { addNote(note) };
}

/**
 * Change note color to the next up
 * @param {*} note 
 */
function colorUpNote(note) {
    if (levels.get(note.color) >= 6) { return; }
    let newColor = levels.get(note.color) + 1;
    note.color = Array.from(levels.entries()).find((item) => item[1] == newColor)[0];
    notebookModel.update();
    saveNotes();
}

/**
 * Change note color to the next down
 * @param {*} note 
 */
function colorDownNote(note) {
    if (levels.get(note.color) <= 0) { return; }
    let newColor = levels.get(note.color) - 1;
    note.color = Array.from(levels.entries()).find((item) => item[1] == newColor)[0];
    notebookModel.update();
    saveNotes();
}

/**
 * Removes a note from the model
 * @param {*} note 
 */
function removeNote(note) {
    notebookModel.remove(note);
    saveNotes();
}

/**
 * Initializes the page
 */
window.onload = () => {
    populateSelect("#color", levels);
    resetForm();
    populateNotes();
};
