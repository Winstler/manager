let db = null;
const request = indexedDB.open("notes");

request.onupgradeneeded = e => {
    db = e.target.result
    /*notes = {
        title: "note1",
        text: "this is the first note"
    }*/
    const pNotes = db.createObjectStore("accounts", {keyPath: "title"})
    console.log("Upgrade is called")
}

request.onsuccess = e => {
    db = e.target.result
    console.log("Success is called")
}

request.onerror = e => {
    console.log(e.target.error)
}

function addNote(){
    const note = {
        title: "new note" + Math.random(),
        text: "this is my note"
    }
    const tx = db.transaction("personal_notes", "readwrite");
    tx.onerror = e => alert(e.target.error)
    const pNotes = tx.objectStore("personal_notes");
    pNotes.add(note);
}
function viewNotes(){
    const tx = db.transaction("personal_notes", "readonly")
    const pNotes = tx.objectStore("personal_notes")
    const request = pNotes.openCursor()
    request.onsuccess = e => {
        const cursor = e.target.result
        if(cursor){
            console.log(`Title: ${cursor.value.title}, Text: ${cursor.value.text}`)
            cursor.continue()
        }
    }
}