const parts = window.location.pathname.split('/');
const raceid = parts[1];

document.querySelector('h2').textContent = `Viewing the results of race ${raceid}`

async function fetchRunners () {
    try {
        const response = await fetch(`/${raceid}/results`);
        if (response.status == 200) {
            const data = await response.json();
            console.log("Result recieved successfully:", data);

            for (const key in data) {
                const runner = document.createElement('p');
                runner.textContent = `RacerID: ${data[key]['runner_id']} | Time: ${data[key]['time']}`
                document.querySelector('section').append(runner);
            }
        }
    } catch (error) {
        console.error("Error uploading result:", error);
    }
}

fetchRunners();

setInterval(async() => {
    try {
    const response = await fetch(`/${raceid}/results-live`);
    if (response.status == 200) {
        const data = await response.json();
        console.log("Result recieved successfully:", data);

        for (const key in data) {
            const runner = document.createElement('p');
            runner.textContent = `RacerID: ${data[key]['runner_id']} | Time: ${data[key]['time']}`
            document.querySelector('section').append(runner);
        }
    }
} catch (error) {
    console.error("Error uploading result:", error);
}
}, 1000)