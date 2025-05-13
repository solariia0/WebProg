async function fetchRaces() {
    const racePreview = document.querySelector('ol');
    const template = document.querySelector('template');
    try {
        const response = await fetch('/races');
        if (response.status == 200){
            const data = await response.json();
            console.log(data);
            for (const key in data) {
                const race = template.content.cloneNode(true).firstElementChild; // section tag
                race.querySelector('h2').textContent = `Race ID: ${data[key]['race_id']}`;
                racePreview.append(race);
                race.addEventListener('click',() => {goToRace(data[key]['race_id'])});
            }
        }
        else {console.log(response.status)}
    } catch (error) {
        console.log(error);
    }
}

function goToRace(raceID) {
    window.location.href = `/${raceID}/view-race`;
}

fetchRaces();