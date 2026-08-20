const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  navMenu.classList.toggle("active");
});

document.addEventListener("click", (e) => {
  if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
    menuToggle.classList.remove("active");
    navMenu.classList.remove("active");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("stickyinput");
  const btnadd = document.getElementById("btnadd");
  const stickydiv = document.getElementById("stickycontainer");
  const searchicon = document.getElementById("searchicon");

  let selectedindex = null;
  loadnotes();

  setInterval(displayTime, 1000);

  searchicon.addEventListener("click", function (e) {
    const searchValue = input.value;
    const notes = JSON.parse(localStorage.getItem("notes")) || [];

    if (searchValue === "") {
      loadnotes();
    } else {
      const newnotes = notes.filter((item) => item.text.includes(searchValue));
      loadnote(newnotes);
    }
  });

  btnadd.addEventListener("click", function () {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];

    let tasktext = input.value.trim();
    if (tasktext === "") {
      alert("Enter Note!");
      return;
    }
    tasktext = tasktext.charAt(0).toUpperCase() + tasktext.slice(1);

    // matched prevention
    let matchednote = notes.find((item) => {
      if (item.text == tasktext) {
        return true;
      }
    });
    if (matchednote) {
      alert("Your current note  is already exits!");
      return;
    }

    saveNotes(tasktext);

    const updatednotes = JSON.parse(localStorage.getItem("notes")) || [];
    const newIndex = updatednotes.length - 1;
    const newNoteObj = updatednotes[newIndex];

    createstickyElement(newNoteObj, newIndex);
    input.value = "";

    loadnotes();
  });

  function createstickyElement(noteObj, index) {
    const box = document.createElement("div");
    box.className = "box";
    stickydiv.appendChild(box);
    const span = document.createElement("span");
    span.className = "span";
    stickydiv.appendChild(span);

    const blackiconsdiv = document.createElement("div");
    blackiconsdiv.className = "blackicons";
    box.appendChild(blackiconsdiv);

    const editicon = document.createElement("i");
    editicon.classList.add("fa-regular", "fa-pen-to-square");
    blackiconsdiv.appendChild(editicon);

    editicon.addEventListener("click", function () {
      if (box.classList.contains("editing")) return;
      box.classList.add("editing");
      const subinput = document.createElement("input");
      subinput.className = "subinput";
      subinput.value = noteObj.text;
      blackiconsdiv.appendChild(subinput);

      const btnupdate = document.createElement("button");
      btnupdate.className = "btnupdate";
      blackiconsdiv.appendChild(btnupdate);
      btnupdate.innerText = "Update";

      selectedindex = index;
      let editedtext = subinput.value;
      subinput.focus();
      //updating
      btnupdate.addEventListener("click", function () {
        let updatedValue = subinput.value.trim();
        if (updatedValue === "") {
          alert("Enter Note!");
          return;
        }
        updatedValue =
          updatedValue.charAt(0).toUpperCase() + updatedValue.slice(1);

        if (selectedindex !== null) {
          const notes = JSON.parse(localStorage.getItem("notes")) || [];
          notes[selectedindex].text = updatedValue;
          localStorage.setItem("notes", JSON.stringify(notes));
          loadnotes();
        }
      });
    });

    const delicon = document.createElement("i");
    delicon.classList.add("fa-solid", "fa-trash");
    blackiconsdiv.appendChild(delicon);

    delicon.addEventListener("click", function () {
      delstickyNotes(index);
    });

    function delstickyNotes(index) {
      const notes = JSON.parse(localStorage.getItem("notes")) || [];
      const notestodel = notes[index];

      notes.splice(index, 1);

      localStorage.setItem("notes", JSON.stringify(notes));
      loadnotes();
    }

    const li = document.createElement("div");
    li.className = "stickynotes";

    box.appendChild(li);

    const timediv = document.createElement("div");
    timediv.className = "time";
    li.appendChild(timediv);

    timediv.innerText = noteObj.Time;

    const stickyTagdiv = document.createElement("div");
    stickyTagdiv.className = "stickytag";
    li.appendChild(stickyTagdiv);
    stickyTagdiv.innerText = noteObj.Title;

    const inputlist = document.createElement("li");
    inputlist.className = "inputlist";
    inputlist.innerText = noteObj.text;
    li.appendChild(inputlist);

    const datediv = document.createElement("div");
    datediv.className = "date";
    li.appendChild(datediv);
    datediv.innerText = noteObj.Date;
  }
  function displayTime() {
    let time = new Date();
    let hrs = time.getHours();
    let min = time.getMinutes();
    let sec = time.getSeconds();
    hrs = hrs % 12;
    if (hrs === 0) {
      hrs = 12;
    }
    if (hrs < 10) hrs = "0" + hrs;
    if (min < 10) min = "0" + min;
    if (sec < 10) sec = "0" + sec;

    return `${hrs}:${min}:${sec}`;
  }
  function displayDate() {
    let day = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let date = new Date();

    let daynum = date.getDay();
    let dayname = day[daynum];

    let todayDate = date.getDate();

    let month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let monthnum = date.getMonth();
    let monthname = month[monthnum];
    let year = date.getFullYear();

    return `${dayname}, ${todayDate} ${monthname}, ${year}`;
  }

  function saveNotes(task) {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const noteObj = {
      text: task,
      Time: displayTime(),
      Date: displayDate(),
      Title: "Sticky Notes",
    };
    notes.push(noteObj);
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  function loadnotes() {
    stickydiv.innerHTML = "";
    const notes = JSON.parse(localStorage.getItem("notes")) || [];

    notes.map(function (note, index) {
      createstickyElement(note, index);
    });
  }

  function loadnote(notes) {
    stickydiv.innerHTML = "";

    notes.map(function (note, index) {
      createstickyElement(note, index);
    });
  }
});
