function loadRaceDetails() {
    const parts = window.location.pathname.split('/');
    const raceid = parts[1]; // e.g. "88"
    const word = document.createElement('p');
    word.textContent = raceid;
    document.body.append(word);
}

loadRaceDetails();