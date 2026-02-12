// --- 1. STATE & INIT ---
let tasks = JSON.parse(localStorage.getItem("u_tasks")) || [];
let classes = JSON.parse(localStorage.getItem("u_classes")) || [];
let grades = JSON.parse(localStorage.getItem("u_grades_v2")) || [];
let contacts = JSON.parse(localStorage.getItem("u_contacts")) || [];
let apps = JSON.parse(localStorage.getItem("u_apps")) || [];

let currentTheme = localStorage.getItem("u_theme") || "violet";
let gradeSystem = localStorage.getItem("u_grade_sys") || "gpa4";

document.addEventListener("DOMContentLoaded", () => {
  document.body.className = `theme-${currentTheme}`;
  document.getElementById("grade-system-selector").value = gradeSystem;
  updateDate();
  initViews();
  const ring = document.getElementById("timer-ring");
  if (ring) {
    ring.style.strokeDasharray = `283 283`;
    ring.style.strokeDashoffset = 0;
  }

  changeGradeSystem(gradeSystem);
});

function initViews() {
  renderDash();
  renderApps();
  renderTasks("all");
  const d = new Date().getDay();
  const dayToRender = d === 0 || d === 6 ? 1 : d;
  renderSchedule(dayToRender);
  renderGrades();
  renderContacts();
}

// --- 2. NAVIGATION ---
window.nav = (view, btn) => {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(`view-${view}`).classList.add("active");

  document
    .querySelectorAll(".nav-item")
    .forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  const fab = document.getElementById("main-fab");
  fab.style.transform = view === "focus" ? "scale(0)" : "scale(1)";

  const scrollContainer = document.querySelector("main");
  if (view === "focus") {
    scrollContainer.style.overflowY = "hidden";
    scrollContainer.scrollTo(0, 0);
  } else {
    scrollContainer.style.overflowY = "auto";
  }
};

// --- 3. APP SHORTCUT LOGIC ---
function renderApps() {
  const dock = document.getElementById("app-dock-container");
  dock.innerHTML = "";

  apps.forEach((app) => {
    const el = document.createElement("a");
    el.href = app.url;
    el.target = "_blank";
    el.className = "app-item";
    el.innerHTML = `
                <div class="icon-box" style="background:${app.color}; color:white; border-radius:20px;">
                    <span class="material-symbols-rounded">${app.icon}</span>
                </div>
                <div class="label" style="font-size:10px; opacity:0.7;">${app.name}</div>
            `;
    dock.appendChild(el);
  });

  // Add Edit Button
  const addBtn = document.createElement("div");
  addBtn.className = "add-app-btn";
  addBtn.onclick = openShortcuts;
  addBtn.innerHTML = `<span class="material-symbols-rounded">add</span>`;
  dock.appendChild(addBtn);
}

window.openShortcuts = () => {
  document.getElementById("shortcutsSheet").classList.add("open");
  renderShortcutList();
};
window.closeShortcuts = () =>
  document.getElementById("shortcutsSheet").classList.remove("open");

window.addShortcut = () => {
  const name = document.getElementById("sc-name").value;
  let url = document.getElementById("sc-url").value;
  const icon = document.getElementById("sc-icon").value || "link";
  const color = document.getElementById("sc-color").value;

  if (!name || !url) return alert("Name and URL required");
  if (!url.startsWith("http")) url = "https://" + url;

  apps.push({ name, url, icon, color });
  saveApps();

  document.getElementById("sc-name").value = "";
  document.getElementById("sc-url").value = "";
  document.getElementById("sc-icon").value = "";

  renderApps();
  renderShortcutList();
};

window.deleteApp = (index) => {
  apps.splice(index, 1);
  saveApps();
  renderApps();
  renderShortcutList();
};

function renderShortcutList() {
  const list = document.getElementById("sc-list");
  list.innerHTML = "";
  apps.forEach((app, i) => {
    list.innerHTML += `
                <div class="app-manage-item">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div style="width:30px; height:30px; border-radius:8px; background:${app.color}; color:white; display:flex; align-items:center; justify-content:center;">
                            <span class="material-symbols-rounded" style="font-size:18px;">${app.icon}</span>
                        </div>
                        <div class="card-title" style="font-size:14px;">${app.name}</div>
                    </div>
                    <button onclick="deleteApp(${i})" style="background:none; border:none; color:#ff4444;"><span class="material-symbols-rounded">delete</span></button>
                </div>
            `;
  });
}

function saveApps() {
  localStorage.setItem("u_apps", JSON.stringify(apps));
}

// --- 4. GRADES LOGIC ---
function changeGradeSystem(val) {
  gradeSystem = val;
  localStorage.setItem("u_grade_sys", val);

  const currentInp = document.getElementById("calc-current");
  const goalInp = document.getElementById("calc-goal");

  if (val.includes("gpa")) {
    currentInp.placeholder = "Current GPA";
    goalInp.placeholder = "Goal GPA";
  } else if (val === "letter") {
    currentInp.placeholder = "Current %";
    goalInp.placeholder = "Goal Letter (A-F)";
  } else if (val === "uk") {
    currentInp.placeholder = "Current %";
    goalInp.placeholder = "Goal (e.g. 70)";
  } else {
    currentInp.placeholder = "Current %";
    goalInp.placeholder = "Goal %";
  }

  renderGrades();
}

function calculatePoints(score, weight) {
  let base = 0;
  if (score >= 93) base = 4.0;
  else if (score >= 90) base = 3.7;
  else if (score >= 87) base = 3.3;
  else if (score >= 83) base = 3.0;
  else if (score >= 80) base = 2.7;
  else if (score >= 77) base = 2.3;
  else if (score >= 73) base = 2.0;
  else if (score >= 70) base = 1.7;
  else if (score >= 67) base = 1.3;
  else if (score >= 65) base = 1.0;
  else base = 0.0;
  return base + parseFloat(weight);
}

function getUKClass(score) {
  if (score >= 70) return "1st";
  if (score >= 60) return "2:1";
  if (score >= 50) return "2:2";
  if (score >= 40) return "3rd";
  return "Fail";
}

function getLetter(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

window.calculateTargetGrade = () => {
  let current = parseFloat(document.getElementById("calc-current").value);
  let goalInput = document.getElementById("calc-goal").value;
  let goal = parseFloat(goalInput);
  const weight = parseFloat(document.getElementById("calc-weight").value) / 100;

  if (isNaN(goal) && gradeSystem === "letter") {
    const letter = goalInput.toUpperCase();
    if (letter === "A") goal = 90;
    else if (letter === "B") goal = 80;
    else if (letter === "C") goal = 70;
    else if (letter === "D") goal = 60;
    else goal = 0;
  }

  if (gradeSystem.includes("gpa")) {
    const max = gradeSystem === "gpa5" ? 5.0 : 4.0;
    current = (current / max) * 100;
    goal = (goal / max) * 100;
  }

  if (isNaN(current) || isNaN(goal) || isNaN(weight) || weight <= 0) {
    document.getElementById("calc-result").innerText = "Enter valid numbers.";
    return;
  }

  const neededPercent = (goal - current * (1 - weight)) / weight;

  let finalOutput = "";
  if (gradeSystem.includes("gpa")) {
    const max = gradeSystem === "gpa5" ? 5.0 : 4.0;
    const neededGPA = (neededPercent / 100) * max;
    finalOutput = `Required on Final: ${neededGPA.toFixed(2)} GPA`;
  } else if (gradeSystem === "letter") {
    finalOutput = `Required on Final: ${neededPercent.toFixed(1)}% (${getLetter(neededPercent)})`;
  } else {
    finalOutput = `Required on Final: ${neededPercent.toFixed(1)}%`;
  }

  document.getElementById("calc-result").innerText = finalOutput;
};

function renderGrades() {
  const list = document.getElementById("grades-list");
  const display = document.getElementById("gpa-display");
  const label = document.getElementById("avg-label");
  list.innerHTML = "";

  let totalQualityPoints = 0;
  let totalCredits = 0;
  let totalScore = 0;

  grades.forEach((g) => {
    const score = parseFloat(g.grade);
    const credits = parseFloat(g.credits || 3);
    const weight = parseFloat(g.weight || 0);
    const points = calculatePoints(score, weight);

    totalQualityPoints += points * credits;
    totalCredits += credits;
    totalScore += score * credits;

    let rowTag = "";
    if (gradeSystem === "percent") rowTag = score + "%";
    else if (gradeSystem === "gpa4" || gradeSystem === "gpa5")
      rowTag = points.toFixed(2);
    else if (gradeSystem === "letter") rowTag = getLetter(score);
    else rowTag = getUKClass(score);

    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
                <div class="card-row" style="justify-content:space-between;">
                    <div>
                        <div class="card-title">${g.title}</div>
                        <div class="body-text">${credits} Credits • ${weight > 0 ? "Weighted" : "Standard"}</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:16px;">
                        <div style="font-size:24px; font-weight:700; color:var(--primary);">${rowTag}</div>
                        <button onclick="delGrade(${g.id})" style="background:none; border:none; opacity:0.5; color:white;"><span class="material-symbols-rounded">close</span></button>
                    </div>
                </div>`;
    list.appendChild(el);
  });

  if (totalCredits === 0) {
    display.innerText = "-";
    label.innerText = "No Grades Yet";
    return;
  }

  const avgScore = totalScore / totalCredits;
  const avgGPA = totalQualityPoints / totalCredits;

  if (gradeSystem === "percent") {
    display.innerText = Math.round(avgScore) + "%";
    label.innerText = "Average Score";
  } else if (gradeSystem === "gpa4" || gradeSystem === "gpa5") {
    display.innerText = avgGPA.toFixed(2);
    label.innerText =
      gradeSystem === "gpa5" ? "Weighted GPA" : "Unweighted GPA";
  } else if (gradeSystem === "uk") {
    display.innerText = getUKClass(avgScore);
    label.innerText = "Classification";
  } else {
    display.innerText = getLetter(avgScore);
    label.innerText = "Overall Grade";
  }
}

// --- 5. TASK LOGIC ---
window.filterTasks = (f, btn) => {
  document
    .querySelectorAll("#view-tasks .chip")
    .forEach((c) => c.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderTasks(f);
};

function renderTasks(f) {
  const list = document.getElementById("task-list");
  list.innerHTML = "";
  let data = f === "all" ? tasks : tasks.filter((t) => t.type === f);
  if (!data.length) {
    list.innerHTML = `<div style="text-align:center; opacity:0.5; margin-top:40px;">No tasks.</div>`;
    return;
  }

  data.forEach((t) => {
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `<div class="card-row"><div style="flex:1;"><div class="card-title">${t.title}</div><div class="body-text">${t.type} • ${t.date}</div></div><button onclick="delTask(${t.id})" style="background:none; border:none; color:#888;"><span class="material-symbols-rounded">delete</span></button></div>`;
    list.appendChild(el);
  });
}

window.delTask = (id) => {
  tasks = tasks.filter((x) => x.id !== id);
  save();
  renderTasks("all");
  renderDash();
};

// --- 6. TIMER LOGIC ---
let timerInt;
let timeLeft = 25 * 60;
let selectedTime = 25;
let isRunning = false;

const timerAlarm = new Audio(
  "https://actions.google.com/sounds/v1/alarms/mechanical_clock_ring.ogg",
);

window.setTimer = (mins, btn) => {
  document
    .querySelectorAll("#focus-opts .chip, #break-opts .chip")
    .forEach((c) => c.classList.remove("active"));
  if (btn) btn.classList.add("active");
  clearInterval(timerInt);
  isRunning = false;
  timerAlarm.pause();
  timerAlarm.currentTime = 0;
  document.getElementById("timer-btn").innerText = "Start";
  selectedTime = mins;
  timeLeft = mins * 60;
  document.getElementById("timer-text").innerText = `${mins}:00`;
  document.getElementById("timer-ring").style.strokeDashoffset = 0;
};

window.toggleTimer = () => {
  const btn = document.getElementById("timer-btn");
  if (isRunning) {
    clearInterval(timerInt);
    isRunning = false;
    btn.innerText = "Resume";
  } else {
    isRunning = true;
    btn.innerText = "Pause";
    timerInt = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        document.getElementById("timer-text").innerText =
          `${m}:${s < 10 ? "0" : ""}${s}`;
        const totalTime = selectedTime * 60;
        document.getElementById("timer-ring").style.strokeDashoffset =
          283 - (timeLeft / totalTime) * 283;
      } else {
        clearInterval(timerInt);
        timerAlarm.play();
        alert("Time's up!");

        resetTimer();
      }
    }, 1000);
  }
};

window.resetTimer = () => {
  timerAlarm.pause();
  timerAlarm.currentTime = 0;
  setTimer(selectedTime);
};

// --- 7. DASH & SCHEDULE ---
function renderSchedule(d, btn) {
  const chips = document.querySelectorAll("#view-schedule .chip");
  chips.forEach((c) => c.classList.remove("active"));

  if (btn) {
    btn.classList.add("active");
  } else {
    const targetChip = chips[d - 1];
    if (targetChip) targetChip.classList.add("active");
  }

  const labels = [
    "Sun",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "Sat",
  ];
  document.getElementById("schedule-day-label").innerText = labels[d] || "Day";

  const list = document.getElementById("schedule-list");
  list.innerHTML = "";
  const dayClasses = classes.filter((c) => c.day == d);
  if (!dayClasses.length) {
    list.innerHTML = `<div style="text-align:center; opacity:0.5; margin-top:40px;">No classes.</div>`;
    return;
  }

  dayClasses.forEach((c) => {
    list.innerHTML += `
            <div class="card">
                <div class="card-row" style="justify-content: space-between;">
                    <div style="display:flex; align-items:center; gap:16px;">
                        <div style="font-weight:700; color:var(--primary); min-width:60px;">${c.time}</div>
                        <div>
                            <div class="card-title">${c.title}</div>
                            <div class="body-text">${c.location}</div>
                        </div>
                    </div>
                    <button onclick="delClass(${c.id})" style="background:none; border:none; opacity:0.5; color:var(--text-muted); cursor:pointer;">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>
            </div>`;
  });
}

function renderDash() {
  const next = tasks.length > 0 ? tasks[0] : null;

  document.getElementById("dash-up-next").innerHTML = next
    ? `<div class="card hero">
                <div class="card-row">
                    <div style="flex:1;">
                        <div class="card-title">${next.title}</div>
                        <div class="body-text">${next.type} • ${next.date || "No Date"}</div>
                    </div>
                </div>
            </div>`
    : `<div class="card"><div class="body-text" style="opacity:0.6;">No upcoming tasks!</div></div>`;

  document.getElementById("dash-current-class").innerHTML = `
            <div class="card">
                <div class="card-row">
                    <div class="icon-box"><span class="material-symbols-rounded">bedtime</span></div>
                    <div>
                        <div class="card-title">Free Time</div>
                        <div class="body-text">No classes right now</div>
                    </div>
                </div>
            </div>`;
}

// --- 8. CONTACTS LOGIC ---
window.renderContacts = (query = "") => {
  const list = document.getElementById("contacts-list");
  list.innerHTML = "";

  let filtered = contacts;
  if (query) {
    filtered = contacts.filter((c) =>
      c.title.toLowerCase().includes(query.toLowerCase()),
    );
  }

  if (!filtered.length) {
    list.innerHTML = `<div style="text-align:center; opacity:0.5; margin-top:40px;">No contacts found.</div>`;
    return;
  }

  filtered.sort((a, b) => a.title.localeCompare(b.title));

  filtered.forEach((c) => {
    let actions = "";
    if (c.phone)
      actions += `<a href="tel:${c.phone}" class="icon-box" style="width:36px; height:36px; background:rgba(255,255,255,0.1);"><span class="material-symbols-rounded" style="font-size:18px">call</span></a>`;
    if (c.email)
      actions += `<a href="mailto:${c.email}" class="icon-box" style="width:36px; height:36px; background:rgba(255,255,255,0.1);"><span class="material-symbols-rounded" style="font-size:18px">mail</span></a>`;

    list.innerHTML += `
        <div class="card">
            <div class="card-row">
                <div class="icon-box" style="background:var(--primary); color:black;">
                    <span class="material-symbols-rounded">person</span>
                </div>
                <div style="flex:1; overflow:hidden;">
                    <div class="card-title" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${c.title}</div>
                    <div class="body-text" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${c.phone || ""} ${c.phone && c.email ? "•" : ""} ${c.email || ""}</div>
                </div>
                <div style="display:flex; gap:8px;">
                    ${actions}
                    <button onclick="delContact(${c.id})" style="background:none; border:none; opacity:0.5; color:var(--text-muted); cursor:pointer;">
                         <span class="material-symbols-rounded">delete</span>
                    </button>
                </div>
            </div>
        </div>
        `;
  });
};

window.delContact = (id) => {
  if (!confirm("Delete contact?")) return;
  contacts = contacts.filter((c) => c.id !== id);
  save();
  renderContacts(document.querySelector("#view-contacts input")?.value || "");
};

// --- 9. ACTIONS & CRUD ---
window.saveItem = () => {
  const cat = document.getElementById("add-category").value;
  const title = document.getElementById("inp-title").value.trim();
  const id = Date.now();
  if (!title) return alert("Title / Name required");

  if (cat === "task") {
    tasks.push({
      id,
      title,
      type: document.getElementById("inp-type").value,
      date: document.getElementById("inp-date").value,
      done: false,
    });
    tasks.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date);
    });
  } else if (cat === "class") {
    classes.push({
      id,
      title,
      location: document.getElementById("inp-loc").value,
      day: document.getElementById("inp-day").value,
      time: document.getElementById("inp-time").value,
    });
    classes.sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));
  } else if (cat === "grade") {
    grades.push({
      id,
      title,
      grade: document.getElementById("inp-grade-val").value || 0,
      credits: document.getElementById("inp-credits").value || 3,
      weight: document.getElementById("inp-weight").value || 0,
    });
  } else if (cat === "contact") {
    contacts.push({
      id,
      title,
      phone: document.getElementById("inp-phone").value,
      email: document.getElementById("inp-email").value,
    });
  }

  window.delClass = (id) => {
    classes = classes.filter((x) => x.id !== id);
    save();
    const chips = Array.from(document.querySelectorAll("#view-schedule .chip"));
    const activeIndex = chips.findIndex((c) => c.classList.contains("active"));
    const dayToRender = activeIndex === -1 ? 1 : activeIndex + 1;

    renderSchedule(dayToRender);
  };

  save();
  closeModal();
  initViews();

  document.getElementById("inp-title").value = "";
  document.getElementById("inp-date").value = "";
  document.getElementById("inp-phone").value = "";
  document.getElementById("inp-email").value = "";
};

window.delGrade = (id) => {
  grades = grades.filter((x) => x.id !== id);
  save();
  renderGrades();
};
function save() {
  localStorage.setItem("u_tasks", JSON.stringify(tasks));
  localStorage.setItem("u_classes", JSON.stringify(classes));
  localStorage.setItem("u_grades_v2", JSON.stringify(grades));
  localStorage.setItem("u_contacts", JSON.stringify(contacts));
}

// 10. BACKUP & RESTORE FUNCTIONS
window.exportData = () => {
  const data = {
    tasks: JSON.parse(localStorage.getItem("u_tasks")),
    classes: JSON.parse(localStorage.getItem("u_classes")),
    grades: JSON.parse(localStorage.getItem("u_grades_v2")),
    contacts: JSON.parse(localStorage.getItem("u_contacts")),
    apps: JSON.parse(localStorage.getItem("u_apps")),
    theme: localStorage.getItem("u_theme"),
  };
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "student-os-backup.json";
  a.click();
};

window.importData = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = JSON.parse(event.target.result);
      if (data.tasks)
        localStorage.setItem("u_tasks", JSON.stringify(data.tasks));
      if (data.classes)
        localStorage.setItem("u_classes", JSON.stringify(data.classes));
      if (data.grades)
        localStorage.setItem("u_grades_v2", JSON.stringify(data.grades));
      if (data.contacts)
        localStorage.setItem("u_contacts", JSON.stringify(data.contacts));
      if (data.apps) localStorage.setItem("u_apps", JSON.stringify(data.apps));
      if (data.theme) localStorage.setItem("u_theme", data.theme);
      location.reload();
    };
    reader.readAsText(file);
  };
  input.click();
};

window.openModal = () =>
  document.getElementById("addSheet").classList.add("open");
window.closeModal = () =>
  document.getElementById("addSheet").classList.remove("open");
window.openSettings = () =>
  document.getElementById("settingsSheet").classList.add("open");
window.closeSettings = () =>
  document.getElementById("settingsSheet").classList.remove("open");
window.setTheme = (t) => {
  document.body.className = `theme-${t}`;
  localStorage.setItem("u_theme", t);
  closeSettings();
};
window.setCat = (c) => {
  document
    .querySelectorAll(".seg-item")
    .forEach((el) => el.classList.remove("active"));
  document.getElementById(`cat-${c}`).classList.add("active");
  document.getElementById("add-category").value = c;

  document.getElementById("form-task").style.display = "none";
  document.getElementById("form-class").style.display = "none";
  document.getElementById("form-grade").style.display = "none";
  document.getElementById("form-contact").style.display = "none";

  // Existing Generic Title Input Handling
  const titleInput = document.getElementById("inp-title");
  if (c === "contact") titleInput.placeholder = "Name (e.g. John Doe)";
  else if (c === "class") titleInput.placeholder = "Class Name";
  else titleInput.placeholder = "Title";

  document.getElementById(`form-${c}`).style.display = "block";
};

function updateDate() {
  const now = new Date();
  const hrs = now.getHours();
  document.getElementById("greeting-text").innerText =
    hrs < 12 ? "Good Morning" : hrs < 18 ? "Good Afternoon" : "Good Evening";
  document.getElementById("date-text").innerText = now.toLocaleDateString(
    "en-US",
    { weekday: "long", month: "long", day: "numeric" },
  );
}
