const parts = window.location.pathname.split('/');
const raceid = parts[1];

const timer = document.querySelector('#stopwatch');
const timerBttn = document.querySelector('#timerBttn');
const recordBttn = document.querySelector('#recordBttn');
const runnerList = document.querySelector('#runners');
const uploadBttn = document.querySelector('#uploadBttn');
const uploadMssg = document.querySelector('#uploadMssg');
const raceID = document.querySelector('#raceID');
const confirmRaceID = document.querySelector('#confirm');


let results = [];
let intervalID;


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
        const editBttn = document.querySelector('#edit_bttn');
        editBttn.style.display = 'none';
        recordBttn.style.display = 'block';
        document.querySelector('.nav_bttn').style.display = 'none';
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
        let entryOrder = 1; // counter to use in db for finding the order
        const runner = document.createElement('li');
        runner.id = 'runner';
        const runnerTime = document.createElement('p');
        const idEntryBox = document.createElement('input');
        idEntryBox.addEventListener('change', () => {updateRunnerID(idEntryBox.value, entryOrder)});

        runner.textContent = 'Racer ID:'
        runnerTime.textContent = `Time: ${timer.textContent}`;
        runnerTime.style.display = 'inline';
        runnerList.append(runner);
        runner.append(idEntryBox, runnerTime);
        entryOrder++;

        try {
            const response = await fetch(`/${raceid}/upload/runner`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: `{"race_id": "${raceid}", "runner_id": "${idEntryBox.value}", "time": "${timer.textContent}"}`
            });
            const data = await response.json();
            console.log("Result uploaded successfully:", data); 
            
            runnerTime.style.color = 'blue';
        } catch (error) {
            console.error("Error uploading result:", error);
            runnerTime.style.color = 'red';
        }
    }
}
recordBttn.addEventListener('click', recordRunner);

async function updateRunnerID(newid, oldid) {
    try {
        const response = await fetch(`/${raceid}/update/runner`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: `{"runner_id": "${newid}", "old_id": "${oldid}"}`
        });
        const data = await response.json();
        console.log("Result uploaded successfully:", data);
        
        runnerTime.style.color = 'blue';
    } catch (error) {
        console.error("Error uploading result:", error);
        runnerTime.style.color = 'red';
    }
}

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

    try { // making it a json? I thibnk?
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

    try { // drop all db contents and reupload?
        // make finished = true
        const response = await fetch('/:raceid/upload/race', {
            method: 'POST',
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

/////

async function loadRaceDetails() {
    document.querySelector('#title').textContent = `Welcome to race ${raceid}!`; //change title?

    try {
        const response = await fetch(`/race/${raceid}`)
        if (response.status == 200) {
            const data = await response.json();
            const allMarshalls = data['marshalls']
            for (var i=1; i <= allMarshalls; i++) {
                const marshall = document.createElement('button');
                marshall.id = "checkpoint";
                marshall.textContent = `record at checkpoint ${i}`;
                document.querySelector('ol').append(marshall);
                marshall.addEventListener('click', () =>
                     {window.location.href = `/${raceid}/checkpoint-${i}`}
                )
            }
        }
    } catch (error) {
        console.log(`error fetching race ${raceid} | error: ${error}`)
    }
}

loadRaceDetails();