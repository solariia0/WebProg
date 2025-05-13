const parts = window.location.pathname.split('/');
const raceid = parts[2];

document.querySelector('h2').textContent = `Viewing the results of race ${raceid}`

async function fetchRunners () {
    try {
        const response = await fetch(`/results/finished/${raceid}`);
        if (response.status == 200) {
            const data = await response.json();
            console.log("Result recieved successfully:", data);

            for (const key in data) {
                const runner = document.createElement('p');
                runner.textContent = `Racer ID: ${data[key]['runner_id']} | Time: ${data[key]['time']}`
                document.querySelector('section').append(runner);
            }
        }
    } catch (error) {
        console.error("Error uploading result:", error);
    }
}

fetchRunners();