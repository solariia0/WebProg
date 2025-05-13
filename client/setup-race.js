async function createRaceID() {
    const formInput = document.querySelectorAll("input");
    const raceData = [];
    formInput.forEach(function (currentValue) {
        raceData.push(currentValue.value)
    });
    raceData.push('false'); // setting the race finishing to false
    console.log(raceData);

    try {
        const response = await fetch('/create-race', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(raceData)
        });
        const data = await response.json();
        console.log("Result uploaded successfully:", data);
        window.location.href = `/${raceData[0]}/view-race`;
    }
    catch (error) {
        console.log(error);
    }
    // go to ./raceID/checkpoint-1 (marshalls can now access ./raceID/checkpoint-id)
}
document.querySelector("button").addEventListener('click', createRaceID);
