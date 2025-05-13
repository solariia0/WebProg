const parts = window.location.pathname.split('/');
const raceid = parts[2];


const timer = document.querySelector('#stopwatch');
const timerBttn = document.querySelector('#timerBttn');
const recordBttn = document.querySelector('#recordBttn');
const runnerList = document.querySelector('#runners');
const uploadBttn = document.querySelector('#uploadBttn');
const uploadMssg = document.querySelector('#uploadMssg');
const raceID = document.querySelector('#raceID');
const confirmRaceID = document.querySelector('#confirm');
const viewResultsBttn = document.querySelector('#view_results');


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
        timerBttn.textContent = 'stop';
        timerBttn.style.backgroundColor = 'rgb(232, 75, 99)';
        uploadMssg.style.display = 'none';
        const editBttn = document.querySelector('#edit_bttn');
        editBttn.style.display = 'none';
        recordBttn.style.display = 'inline';
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
        const runner = document.createElement('p');
        runner.id = 'runner';
        const runnerTime = document.createElement('p');
        const idEntryBox = document.createElement('input');

        runner.textContent = 'Racer ID:';
        runnerTime.textContent = `Time: ${timer.textContent}`;
        runnerTime.style.display = 'inline';
        runnerList.append(runner);
        runner.append(idEntryBox, runnerTime);
        
        //results.push(`{"race_id": "${raceid}", "runner_id": "${idEntryBox.value}", "time": "${timer.textContent}"}`);
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

        output = {"id": `${runnerIDs[i].value}`, "time": `${runnerTimes[i].textContent.slice(6)}`};
        results.push(output);
    }

    // uploading all times to the database
    try {
        const response = await fetch(`/results/${raceid}`, {
            method: 'POST',
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
        viewResultsBttn.style.display = 'block';

        const resultsList = document.querySelectorAll('#runner');
        for (const item of resultsList) {
            item.remove();
        }
        results = [];

    } catch (error) {
        console.error("Error uploading result:", error);
    }

    // updating the database values to mark the race as finished
    await fetch(`/finished/${raceid}`);
}
uploadBttn.addEventListener('click', uploadRace);

viewResultsBttn.addEventListener('click', () => {window.location.href = `/finished-results/${raceid}`;})


function main() {
    document.querySelector('h2').textContent = `Welcome to race ${raceid}!`;
}

main();