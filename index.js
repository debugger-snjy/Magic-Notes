console.log("Welcome To Magic Notes.");
console.log("You can save notes in this webapp and this will be saved");
console.log("Your Privacy is maintained !!");

// Display all the notes
showNotes();

// Checking for the Offline or Online 
let wentoffline = 0;
window.addEventListener('online', () => {
    // console.log('Became online');
    if (wentoffline == 1) {
        // alert("you are back online");
        wentoffline = 0;
        document.getElementById('issues').innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
                                                                <strong> Online 📱</strong> You are Back Online! All Features are Upto Date 😊😃
                                                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                                            </div>`;
        setTimeout(() => {
            document.getElementById('issues').innerHTML = '';
        }, 3000);
    }
});
window.addEventListener('offline', () => {
    // console.log('Became offline');
    // alert("You are Offline");
    wentoffline = 1;
    document.getElementById('issues').innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                                                                <strong> Offline 📴</strong> You are Offline! Some Features may not Work Properly 😭😟😞
                                                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                                            </div>`;
    setTimeout(() => {
        document.getElementById('issues').innerHTML = '';
    }, 3000);
});

// If User adds a notes, add it to the local storage
let addBtn = document.getElementById('addBtn');

addBtn.addEventListener('click', function () {
    let curr_dt_tim = new Date();
    // console.log(curr_dt_tim);
    let noteText = document.getElementById('addTxt');
    let notes = localStorage.getItem("notes_data");

    let titleTxt = document.getElementById('NoteTitle');

    if (notes == null) {
        notesObj = [];
    }
    else {
        notesObj = JSON.parse(notes);

    }
    months = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    days = ["Sun", "Mon", "Tues", "Wed", "Thrus", "Fri", "Sat"];
    if ((noteText.value != null && titleTxt.value != null) && (noteText.value != "" && titleTxt.value != "")) {
        // console.log("1");
        let mynotesObj = {
            title: titleTxt.value,
            text: noteText.value,
            day: days[curr_dt_tim.getDay()],
            dt: curr_dt_tim.getDate(),
            mon: months[curr_dt_tim.getMonth()],
            yr: curr_dt_tim.getFullYear(),
            hr: curr_dt_tim.getHours() > 12 ? curr_dt_tim.getHours() - 12 : curr_dt_tim.getHours(),
            min: curr_dt_tim.getMinutes() < 10 ? "0" + curr_dt_tim.getMinutes() : curr_dt_tim.getMinutes(),
            duration: (this.hr > 12) ? "AM" : "PM",
            edited: 0,
        };
        notesObj.push(mynotesObj);
        localStorage.setItem('notes_data', JSON.stringify(notesObj));
        noteText.value = "";
        titleTxt.value = "";
    }
    else if ((noteText.value != null || titleTxt.value == null) && (noteText.value != "" || titleTxt.value == "")) {
        // console.log("2");
        alert("Please Insert Title Bar for the Note");
    }
    else if ((noteText.value == null || titleTxt.value != null) && (noteText.value == "" || titleTxt.value != "")) {
        // console.log("3");

        alert("Please Insert Note");
    }

    // console.log("notes :",notesObj);
    showNotes();
});

// Getting the Notes from the Local Storage
let notes = localStorage.getItem("notes_data");
// console.log(notes);
// If no notes are available, then we will not be searching any notes

let searchNote = document.getElementById('searchNote');

searchNote.addEventListener("input", function () {
    let inputTxt = searchNote.value;
    // console.log(inputTxt);
    // document.getElementById('searchNote').value="";

    let noteCards = document.getElementsByClassName('noteCard');
    let notesnotfound = 0;
    let notesfound = 0;
    Array.from(noteCards).forEach(function (element) {

        let noteTxt = element.getElementsByTagName("p")[0].innerHTML;
        let noteTitle = element.getElementsByTagName("h5")[0].innerHTML;
        // console.log(noteTxt);
        // console.log(noteTitle);
        if (noteTxt.includes(inputTxt) || noteTitle.includes(inputTxt)) {
            element.style.display = "block";
            notesfound++;
        }
        else {
            element.style.display = "none";
            notesnotfound++;
        }
    });

    if (notesnotfound == noteCards.length) {
        // console.log("No Notes found !!");
        document.getElementById('status').innerHTML = `No Note(s) Found 😟`
        document.getElementById('status').style.backgroundColor = "rgb(255 0 0 / 70%)";
    }
    else {
        document.getElementById('status').innerHTML = `${notesfound} Note(s) Found 😊`
        document.getElementById('status').style.backgroundColor = "rgb(0 255 0 / 70%)";
    }

});


// Displaying all the notes
function showNotes() {
    let notes = localStorage.getItem("notes_data");
    if (notes == null) {
        notesObj = [];
    }
    else {
        notesObj = JSON.parse(notes);
    }

    // console.log(notesObj);
    let html = `<form class="d-lg-flex" id="searching">
                    <input class="form-control me-2" id="searchNote" placeholder="Search Notes" aria-label="Search" autocomplete="off">
                    <div id='status'>Results on search will appear here</div>
                </form>`;
    notesObj.forEach(function (element, index) {
        html += `
            <div class="card noteCard mx-3 my-3" style="width: 16rem;position: static;">
                <div class="card-body ">
                    <span id="notedt_time">${element.day}, ${element.dt} ${element.mon} ${element.yr}, ${element.hr}:${element.min} ${element.duration}</span>
                    <h5 class="card-title noteTitle">${element.title}</h5>
                    <hr size="4" width=100%>
                    <p class="card-text NoteTxt_Data" id="NoteTxt_Data">${element.text}</p>

                    <!-- This is first Way to delete note -->
                    <!-- <button class="btn btn-primary" id="Notes${index + 1}" onclick="delNote('${index + 1}')">Delete Note</button>-->
                    
                    <!-- This is Second Way to delete note and using this.id wil give us the value of id of that element-->
                    <button class="btn btn-primary DelBtn" id="${index}" onclick="delNote(this.id)">Delete Note</button>
                    <button class="btn btn-primary EditBtn" id="${index}" onclick="editNote(this.id)">Edit Note</button>
                </div>
            </div>
        `;
    });
    let notesElem = document.getElementById('notes');

    if (notesObj.length != 0) {
        notesElem.innerHTML = html;
        document.getElementById('status').innerHTML = `${notesObj.length} Note(s) Found 😊`
        document.getElementById('status').style.backgroundColor = "rgb(0 255 0 / 70%)";
    }
    else {
        notesElem.innerHTML = `<span>Nothing to show! Use <b>"<i class="bi bi-plus-circle"></i>Add a Note"</b> Section above to add notes.</span>`;
        notesElem.style = "font-size:22px;letter-spacing:1px";
    }
}

// Deleting the notes
function delNote(noteId) {
    // console.log(noteId);
    let notes = JSON.parse(localStorage.getItem("notes_data"));

    noteId = parseInt(noteId);
    let final_ask = confirm("Do you Want to Delete Note " + (notes[noteId].title) + " ?");

    if (final_ask) {
        // console.log(notes);
        notes.splice(parseInt(noteId), 1);
        // console.log(notes);
        localStorage.setItem('notes_data', JSON.stringify(notes));
        showNotes();
    }
}

// Editing the note
function editNote(NoteId) {
    // console.log(NoteId);

    document.body.scrollTop = document.documentElement.scrollTop = 0;

    document.getElementById('issues').innerHTML = `<div class="alert alert-danger d-flex align-items-center" role="alert">
                                                        <center>⚠ <b>Alert : If You Don't click on <b>Add Note</b> Your Note will be removed ⚠</center>
                                                   </div>`;
    setTimeout(() => {
        document.getElementById('issues').innerHTML = '';
    }, 5000);

    let notes = JSON.parse(localStorage.getItem("notes_data"));

    notes.forEach(function (element, index) {
        if (index == NoteId) {
            document.getElementById('addTxt').value = element.text;
            document.getElementById('NoteTitle').value = element.title;

            // let final_ask = confirm("Do you Want to Edit This Note "+(notes[NoteId].title)+" ?");

            // if(final_ask){
            //     // console.log(notes);
            //     notes.splice(parseInt(NoteId),1);
            //     // console.log(notes);
            //     localStorage.setItem('notes_data',JSON.stringify(notes));
            //     showNotes();
            // }
            notes.splice(parseInt(NoteId), 1);
            localStorage.setItem('notes_data', JSON.stringify(notes));
            showNotes();
        }
    });

}