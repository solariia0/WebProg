const timer = document.getElementById('timer');
const timerBttn = document.getElementById('timerBttn');
const recordBttn = document.getElementById('recordBttn');
const runnerList = document.getElementById('runners');
const uploadBttn = document.getElementById('uploadBttn');

let results = [];
let intervalID;

// don't allow a race to be run if it hasn't been uploaded
function stopwatch() {
    let time = 0;

    if (timerBttn.textContent === 'start') {
        timerBttn.textContent = 'stop'
        // is there a better way to do this?
        timerBttn.style.backgroundColor = 'rgb(232, 75, 99)';

        // automatically stop the timer when 24hrs hits
        intervalID = setInterval(() => {
            time = time + 1;
            sec = Math.round((time / 10) % 60);
            min = Math.floor((time / 10) / 60);
            hour = Math.floor((time / 10) / 120);
            timer.textContent = `${hour} : ${min} : ${sec} : ${time % 60}`;
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


function recordRunner() {
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
    }
}
recordBttn.addEventListener('click', recordRunner);

// upload once per race
async function uploadRace() {
    const runnerTimes = document.querySelectorAll('#runner p');
    const runnerIDs = document.querySelectorAll('#runner input');
    let output = '';
    
    for (let i = 0; i < runnerIDs.length; i++) {
        output = `{"id": "${runnerIDs[i].value}"`;
        output += `, "time": "${runnerTimes[i].textContent.slice(6)}"}`;
        output = JSON.parse(output);
        results.push(output);
    }

    try {
        const response = await fetch('/results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(results)
        });
        const data = await response.json();
        console.log("Result uploaded successfully:", data);

        timerBttn.removeAttribute('disabled');
        uploadBttn.style.display = 'none';
        const uploadMsg = document.createElement('p');
        uploadMsg.textContent = 'Race Uploaded!';
        document.body.append(uploadMsg);

    } catch (error) {
        console.error("Error uploading result:", error);
        alert("Error uploading result.");
    }
}
uploadBttn.addEventListener('click', uploadRace)