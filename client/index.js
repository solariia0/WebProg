//
const pages = [
    {
        screen: 'homepage',
        title: 'Home'
    },
    {
        screen: 'stopwatch',
        title: 'Timing a race'
    },
    {
        screen: 'live-tracking',
        title: 'Tracking'
    },
    {
        screen: 'view-results',
        title: 'Results'
    },
    {
        screen: 'error',
        title: 'Error'
    }
];

const ui = {};
const templates = {};

function getUIElem() {
    ui.main = document.querySelector('main');
    ui.screens = {};

    ui.getScreens = () => Object.values(ui.screens);

    templates.screen = document.querySelector('#tmp-screen');
  }

function makeScreens() {
const template = templates.screen;
for (const page of pages) {
    const section = template.content.cloneNode(true).firstElementChild;

    // set the title of the section, with the first letter capitalised
    const title = section.querySelector('.title');
    title.textContent = page.title;

    // need a refresher on what dataset is
    section.dataset.id = `sect-${page.screen}`;
    section.dataset.name = page.screen;

    ui.main.append(section);
    ui.screens[page.screen] = section;
}
}

function setupHomepage() {
    const homeBttns = ui.screens['homepage'].querySelectorAll('button');
    for (const button of homeBttns) {
        button.addEventListener('click', show);
        button.addEventListener('click', storeState); 
    }
    
}

async function fetchScreenContent(screen) {
    const url = `/screens/${screen}.inc`;
    const response = await fetch(url);
    if (response.ok) {
        return await response.text();
    } else {
        return `sorry, a ${response.status} error ocurred retrieving section data for: <code>${url}</code>`;
    }
}

async function putScreenContent() {
for (const page of pages) {
    const content = await fetchScreenContent(page.screen);
    const section = document.createElement('section');
    section.innerHTML = content;
    ui.screens[page.screen].append(section);
}
}

// might affect homepage check
function hideAllScreens() {
    for (const screen of ui.getScreens()) {
        hideElement(screen);
    }
}

// erm what the freak
function show(event) {
    // ui.previous is used after one of the buttons on the login screen
    // is pressed to return the user to where they were.
    ui.previous = ui.current;
    const screen = event?.target?.dataset?.screen ?? 'home';
    showScreen(screen);
}

function showScreen(name) {
    hideAllScreens();
    if (!ui.screens[name]) {
        name = 'error';
    }
    showElement(ui.screens[name]);

    ui.current = name;
    document.title = name;
}

// can't I just put an empty string in the second param since it's unused? what's the point of putting ui.current again
function storeState() {
    history.pushState(ui.current, ui.current, `/app/${ui.current}`);
}

function showElement(e) {
    e.classList.remove('hidden');
}

function hideElement(e) {
    e.classList.add('hidden');
}


// that was all the ui stuff uhm code! thanks matt and rich <3

// how badly designed is the structure of the functions lol
// should it just be put in a separte js file and called when need be?
function raceTiming() {

const timer = document.getElementById('stopwatch');
const timerBttn = document.getElementById('timerBttn');
const recordBttn = document.getElementById('recordBttn');
const runnerList = document.getElementById('runners');
const uploadBttn = document.getElementById('uploadBttn');
const uploadMssg = document.querySelector('#uploadMssg');
const raceID = document.querySelector('#raceID');
const confirmRaceID = document.querySelector('#confirm');


let results = [];
let intervalID;

function makeRace() { // make sure you can't upload a race without saving a race id
    results.push({race_id: raceID.value});
    raceID.setAttribute('disabled', true);
    console.log(`saved raceID: ${raceID.value}`);
}
confirmRaceID.addEventListener('click', makeRace)

function formatTime(time) {
    if (time < 10) {
        time = `0${time}`;
    }
    return time;
}


function stopwatch() {
    let time = 0;

    if (timerBttn.textContent === 'start') {
        timerBttn.textContent = 'stop'
        timerBttn.style.backgroundColor = 'rgb(232, 75, 99)';
        uploadMssg.style.display = 'none';
        localStorage.clear();

        intervalID = setInterval(() => {
            time = time + 1;
            sec = formatTime(Math.round((time / 10) % 60));
            min = formatTime(Math.floor((time / 10) / 60));
            hour = formatTime(Math.floor((time / 10) / 120));
            if (hour == 24) { // Q: how can we test this cause uhhh idk
                const raceAlert = document.createAttribute('p');
                raceAlert.textContent = 'Race Over';
                document.body.append(raceAlert);
                uploadRace();
            } else {
                timer.textContent = `${hour} : ${min} : ${sec} : ${formatTime(time % 60)}`;
            }
        }, 100);
    }
    else {
        timerBttn.style.backgroundColor = 'rgb(73, 191, 136)';
        timerBttn.textContent = 'start';
        timer.textContent = '00 : 00 :00 : 00';

        clearInterval(intervalID);
        intervalID = null;

        uploadBttn.style.display = 'inline';
        timerBttn.setAttribute('disabled', true);
    }
}
timerBttn.addEventListener('click', stopwatch);

async function recordRunner() {
    if (intervalID != null) { // Only allows laps to be recorded if a timer is running
        const runner = document.createElement('li');
        runner.id = 'runner';
        const runnerTime = document.createElement('p');
        const idEntryBox = document.createElement('input');

        runner.textContent = 'Racer ID:'
        runnerTime.textContent = `Time: ${timer.textContent}`;
        runnerTime.style.display = 'inline';
        runnerList.append(runner);
        runner.append(idEntryBox, runnerTime);

        try {
            const response = await fetch('/results', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: `{"id": "${idEntryBox.value}", "time": "${timer.textContent}"}`
            });
            const data = await response.json();
            console.log("Result uploaded successfully:", data);  
            
            runnerTime.style.color = 'blue';
        } catch (error) {
            console.error("Error uploading result:", error);
            runnerTime.style.color = 'red';
            errorMsg = document.createElement('p');
            errorMsg.textContent = 'failed to upload to server';
            document.body.append(errorMsg);
        }
    }
}
recordBttn.addEventListener('click', recordRunner);

// make it so it only uploads once per race
// upload results that fail to upload to the server to localstorage to be uploaded later
async function uploadRace() {
    const runnerTimes = document.querySelectorAll('#runner p');
    const runnerIDs = document.querySelectorAll('#runner input');
    let output = '';
    
    for (let i = 0; i < runnerIDs.length; i++) {
        // uploading to localstorage
        localStorage.setItem(`${runnerIDs[i].value}`, `${runnerTimes[i].textContent.slice(6)}`);

        output = `{"id": "${runnerIDs[i].value}"`;
        output += `, "time": "${runnerTimes[i].textContent.slice(6)}"}`;
        output = JSON.parse(output);
        results.push(output);
    }

    try {
        const response = await fetch('/results', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(results)
        });
        const data = await response.json();
        console.log("Result uploaded successfully:", data);

        // disabling start button
        timerBttn.removeAttribute('disabled');
        uploadBttn.style.display = 'none';
        uploadMssg.style.display = 'inline';

        const resultsList = document.querySelectorAll('#runner');
        for (const item of resultsList) {
            item.remove();
        }
        results = [];

    } catch (error) {
        console.error("Error uploading result:", error);
        alert("Error uploading result.");
    }

    try {
        const response = await fetch('/results/bulk', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(results)
        });
        const data = await response.json();
        console.log("Result uploaded successfully:", data);
    } catch (error) {
        console.error("Error uploading result:", error);
    }
}
uploadBttn.addEventListener('click', uploadRace);
}

// erm I want to use this as a template for fetching results from races based on ID
// it currently does *not* do that
async function viewRaceResults () {
    const raceResults = document.querySelector('#results');

    const response = await fetch('messages');
    let results;
    if (response.ok) {
      messages = await response.json();
    } else {
      messages = [{ msg: 'failed to load messages :-(' }];
    }

    for (const result of results) {
        const resultElem = document.createElement('li');
        resultElem.textContent = message;
        raceResults.append(result);
    }
}

async function getRaceResults(id) {
    const response = await fetch(`/user/${userid}`);
    if (response.ok) {
        return await response.json();
    } else {
        return false;
    }
}

function loadInitialScreen() {
    ui.current = 'home'
    showScreen(ui.current);
  }

async function main() {
    getUIElem();
    makeScreens();
    await putScreenContent();
    setupHomepage();
    raceTiming();
    viewRaceResults();
    window.addEventListener('popstate', showScreen('homepage'));
    ui.current = 'homepage';
    showScreen(ui.current);
}

main();