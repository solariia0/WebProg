const timer = document.getElementById('timer');
const timerBttn = document.getElementById('timerBttn');
const recordBttn = document.getElementById('recordBttn');
const runnerList = document.getElementById('runners');
const uploadBttn = document.getElementById('uploadBttn');
const uploadMssg = document.querySelector('#uploadMssg');

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
                body: `{"id": "${idEntryBox.value}", "time": "${timer.textContent}"},\\n`
            });
            const data = await response.json();
            console.log("Result uploaded successfully:", data);    
        } catch (error) {
            console.error("Error uploading result:", error);
            alert("Error uploading result.");
        }
    }
}
recordBttn.addEventListener('click', recordRunner);

// upload once per race
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
}
uploadBttn.addEventListener('click', uploadRace)