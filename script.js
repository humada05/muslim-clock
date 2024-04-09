function updateClock() {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const hourDeg = (hours * 30) + (0.5 * minutes);
    const minuteDeg = (minutes * 6) + (0.1 * seconds);
    const secondDeg = seconds * 6;

    document.querySelector('.hour-hand').style.transform = `rotate(${hourDeg}deg)`;
    document.querySelector('.minute-hand').style.transform = `rotate(${minuteDeg}deg)`;
    document.querySelector('.second-hand').style.transform = `rotate(${secondDeg}deg)`;

    setTimeout(updateClock, 1000);
}

updateClock();
