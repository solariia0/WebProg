async function createRace() {
    const formInput = document.querySelectorAll("input");
    const raceData = [];
    formInput.forEach(function (currentValue) {
        raceData.push(currentValue.value)
    });
    raceData.push('false'); // setting the race finished to false
    console.log(raceData);

    try {
        const response = await fetch('/race', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(raceData)
        });
        window.location.href = `/stopwatch/${raceData[0]}`;
    }
    catch (error) {
        console.log(error);
    }
}
document.querySelector("button").addEventListener('click', createRace);
