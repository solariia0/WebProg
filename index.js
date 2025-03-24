const timerText = document.getElementById('timer');
const timerBttn = document.getElementById('startBttn');
const lapBttn = document.getElementById('lapBttn');
const lapList = document.getElementById('laps');

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
            timerText.textContent = `${hour}h : ${min}m : ${sec}s : ${time % 60}ms`;
        }, 100);
    }
    else {
        timerBttn.style.backgroundColor = 'rgb(73, 191, 136)';
        timerBttn.textContent = 'start';
        timerText.textContent = '00h : 00m :00s : 00ms';
        clearInterval(intervalID);
        intervalID = null;
    }
}
timerBttn.addEventListener('click', stopwatch);

// allow editing the racerIDs after the race has ended??
function lap() {
    const newLap = document.createElement('li');
    //newLap.style.display('inline');

    //find out how if you can shorten this
    //find out how to add default text with a different style
    const newLapID = document.createElement('p');
    newLapID.classList.add('racerID');
    newLapID.setAttribute('contenteditable', 'plaintext-only');
    //newLapID.style.display('inline');

    const newLapTime = document.createElement('p');
    //newLapTime.style.display('inline');


    if (intervalID != null) { // Only allows laps to be recorded if a timer is running
        newLap.textContent = 'Racer ID:'
        newLapID.textContent = 'type racer ID here';
        newLapTime.textContent = `Time: ${timerText.textContent}`;
        lapList.append(newLap, newLapID, newLapTime);
    }
}
lapBttn.addEventListener('click', lap);

// upload race data to a JSON
function uploadRace() {
    
}