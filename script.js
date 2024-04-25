import PrayTimes from "./prayTimes.js"

const UI = {
  second: document.querySelector('.hand--second'),
  minute: document.querySelector('.hand--minute'),
  hour: document.querySelector('.hand--hour'),

  dhuhr_arc: document.querySelector('.dhuhr-arc'),
  asr_arc: document.querySelector('.asr-arc'),
  maghrib_arc: document.querySelector('.maghrib-arc'),
  isha_arc: document.querySelector('.isha-arc'),
  fajr_arc: document.querySelector('.fajr-arc')
}

function timeToDegrees(time) {
  // Destructure hours and minutes from the time string
  const [hours, minutes] = time.split(':').map(Number);

  // Calculate degrees for hour hand
  const hourDegrees = hours * 30 + (minutes / 2);

  return hourDegrees;
};

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle){

    var start = polarToCartesian(x, y, radius, startAngle);
    var end = polarToCartesian(x, y, radius, endAngle);
    var angleDiff = endAngle - startAngle
    
    if (angleDiff < 0) angleDiff = 360 + angleDiff%360

    var largeArcFlag = angleDiff > 180 ? 1 : 0;

    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
    ].join(" ");

    return d;       
}

const updateClock = () => {
  // GETTING TIME
  const now = new Date();
  // const date = now.getDate();
  const seconds = (now.getSeconds() + now.getMilliseconds() / 1000) / 60 * 360;
  const minutes = (now.getMinutes() + now.getSeconds() / 60) / 60 * 360;
  const hours = (now.getHours() + now.getMinutes() / 60) / 12 * 360;

  const prayTimes = new PrayTimes('ISNA').getTimes(new Date(), [37.8, -122])

  const fajr = timeToDegrees(prayTimes['fajr'])
  const sunrise = timeToDegrees(prayTimes['sunrise'])
  const dhuhr = timeToDegrees(prayTimes['dhuhr'])
  const asr = timeToDegrees(prayTimes['asr'])
  const maghrib = timeToDegrees(prayTimes['maghrib'])
  const isha = timeToDegrees(prayTimes['isha'])


  // UI Update
  UI.second.style.transform = `rotate(${seconds}deg)`;
  UI.minute.style.transform = `rotate(${minutes}deg)`;
  UI.hour.style.transform = `rotate(${hours}deg)`;

  const biggerRadius = 180;
  const smallerRadius = 145;

  UI.dhuhr_arc.setAttribute("d", describeArc(0, 0, smallerRadius, dhuhr, asr));
  UI.asr_arc.setAttribute("d", describeArc(0, 0, smallerRadius, asr, maghrib));
  UI.maghrib_arc.setAttribute("d", describeArc(0, 0, smallerRadius, maghrib, isha));
  UI.isha_arc.setAttribute("d", describeArc(0, 0, biggerRadius, isha, fajr));
  UI.fajr_arc.setAttribute("d", describeArc(0, 0, biggerRadius, fajr, sunrise));

  // if (dhuhr < hours && hours < asr) {
    // UI.dhuhr_arc.style.stroke = "var(--red)";
    // UI.dhuhr_arc.style.strokeWidth = "2";
  // } else if (asr < hours && hours < maghrib) {
    // UI.asr_arc.style.stroke = "blue";
    // UI.asr_arc.style.strokeWidth = "3";
  // } else if (maghrib < hours && hours < isha) {
    // UI.maghrib_arc.style.stroke = "brown";
    // UI.maghrib_arc.style.strokeWidth = "3";
  // }
  //  else if ()

  requestAnimationFrame(updateClock)
}

requestAnimationFrame(updateClock);
