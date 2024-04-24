import PrayTimes from "./prayTimes.js"

const UI = {
  second: document.querySelector('.hand--second'),
  minute: document.querySelector('.hand--minute'),
  hour: document.querySelector('.hand--hour'),
  // fajr: document.querySelector('.fajr'),
  dhuhr: document.querySelector('.dhuhr'),
  dhuhr_arc: document.querySelector('.dhuhr-arc'),

  asr: document.querySelector('.asr'),
  asr_arc: document.querySelector('.asr-arc'),
  
  maghrib: document.querySelector('.maghrib'),
  maghrib_arc: document.querySelector('.maghrib-arc'),

  isha: document.querySelector('.isha'),
  isha_arc: document.querySelector('.isha-arc')
}

function timeToDegrees(time) {
  // Destructure hours and minutes from the time string
  const [hours, minutes] = time.split(':').map(Number);

  // Calculate degrees for hour hand
  const hourDegrees = (hours % 12) * 30 + (minutes / 2);

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

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

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

  const dhuhr = timeToDegrees(prayTimes['dhuhr'])
  const asr = timeToDegrees(prayTimes['asr'])
  const maghrib = timeToDegrees(prayTimes['maghrib'])
  const isha = timeToDegrees(prayTimes['isha'])


  // UI Update
  UI.second.style.transform = `rotate(${seconds}deg)`;
  UI.minute.style.transform = `rotate(${minutes}deg)`;
  UI.hour.style.transform = `rotate(${hours}deg)`;

  UI.dhuhr.style.transform = `rotate(${dhuhr}deg)`;
  UI.asr.style.transform = `rotate(${asr}deg)`;
  UI.maghrib.style.transform = `rotate(${maghrib}deg)`;
  UI.isha.style.transform = `rotate(${isha}deg)`;

  UI.dhuhr_arc.setAttribute("d", describeArc(0, 0, 145, dhuhr, asr));
  UI.asr_arc.setAttribute("d", describeArc(0, 0, 145, asr, maghrib));
  UI.maghrib_arc.setAttribute("d", describeArc(0, 0, 145, maghrib, isha));
  UI.isha_arc.setAttribute("d", describeArc(0, 0, 145, isha, 0));

  requestAnimationFrame(updateClock)
}

requestAnimationFrame(updateClock);
