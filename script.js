import PrayTimes from "./prayTimes.js"

const UI = {
  second: document.querySelector('.hand--second'),
  minute: document.querySelector('.hand--minute'),
  hour: document.querySelector('.hand--hour'),

  dhuhr_arc: document.querySelector('.dhuhr-arc'),
  asr_arc: document.querySelector('.asr-arc'),
  maghrib_arc: document.querySelector('.maghrib-arc'),
  isha_arc: document.querySelector('.isha-arc'),
  fajr_arc: document.querySelector('.fajr-arc'),

  dhuhr_txt: document.querySelector("#dhuhr"),
  asr_txt: document.querySelector("#asr"),
  maghrib_txt: document.querySelector("#maghrib"),
  isha_txt: document.querySelector("#isha"),
  fajr_txt: document.querySelector("#fajr"),

  prayer_tracker: document.querySelector("#prayer-tracker")
}

function timeToDegrees(time) {
  // Destructure hours and minutes from the time string
  const [hours, minutes] = time.split(':').map(Number);

  // Calculate degrees for hour hand
  const hourDegrees = hours * 30 + (minutes / 2);

  return hourDegrees;
};

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {

  var start = polarToCartesian(x, y, radius, startAngle);
  var end = polarToCartesian(x, y, radius, endAngle);
  var angleDiff = endAngle - startAngle

  if (angleDiff < 0) angleDiff = 360 + angleDiff % 360

  var largeArcFlag = angleDiff > 180 ? 1 : 0;

  var d = [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
  ].join(" ");

  return d;
}

function transformText(x, y, radius, startAngle, endAngle) {
  var centerAngle = (startAngle + endAngle) / 2;
  var rotationAngle = centerAngle;
  var padding = 5;
  if ( 4*30 < centerAngle%360 && centerAngle%360 < 8*30) {
    rotationAngle += 180;
    padding = 25
  }

  var translationPoint = polarToCartesian(x, y, radius + padding, centerAngle);

  // = ( 4*30 < centerAngle%360 && centerAngle%360 < 8*30) ? centerAngle+180 : centerAngle;
  return `translate(${translationPoint.x}, ${translationPoint.y}) rotate(${rotationAngle})`;
}

const updateClock = () => {
  // GETTING TIME
  const now = new Date();
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

  const opacityAlpha = 0.4;

  const prayerTackerCoordinates = (isha < hours || hours < sunrise) ? polarToCartesian(0, 0, biggerRadius, hours) : polarToCartesian(0, 0, smallerRadius, hours);

  // garbage code pleaaaase get rid of this 🙏
  UI.dhuhr_arc.setAttribute("d", describeArc(0, 0, smallerRadius, dhuhr, asr));
  UI.asr_arc.setAttribute("d", describeArc(0, 0, smallerRadius, asr, maghrib));
  UI.maghrib_arc.setAttribute("d", describeArc(0, 0, smallerRadius, maghrib, isha));
  UI.isha_arc.setAttribute("d", describeArc(0, 0, biggerRadius, isha, fajr));
  UI.fajr_arc.setAttribute("d", describeArc(0, 0, biggerRadius, fajr, sunrise));

  UI.dhuhr_txt.setAttribute("transform", transformText(0, 0, smallerRadius, dhuhr, asr));
  UI.asr_txt.setAttribute("transform", transformText(0, 0, smallerRadius, asr, maghrib));
  UI.maghrib_txt.setAttribute("transform", transformText(0, 0, smallerRadius, maghrib, isha));
  UI.isha_txt.setAttribute("transform", transformText(0, 0, biggerRadius, isha, fajr));
  UI.fajr_txt.setAttribute("transform", transformText(0, 0, biggerRadius, fajr, sunrise));


  UI.fajr_arc.style.stroke = UI.fajr_txt.style.stroke = UI.fajr_txt.style.fill = "var(--highlight)";
  UI.fajr_arc.style.opacity = UI.fajr_txt.style.opacity = opacityAlpha;
  UI.dhuhr_arc.style.stroke = UI.dhuhr_txt.style.stroke = UI.dhuhr_txt.style.fill = "var(--highlight)";
  UI.dhuhr_arc.style.opacity = UI.dhuhr_txt.style.opacity = opacityAlpha;
  UI.asr_arc.style.stroke = UI.asr_txt.style.stroke = UI.asr_txt.style.fill = "var(--highlight)";
  UI.asr_arc.style.opacity = UI.asr_txt.style.opacity = opacityAlpha;
  UI.maghrib_arc.style.stroke = UI.maghrib_txt.style.stroke = UI.maghrib_txt.style.fill = "var(--highlight)";
  UI.maghrib_arc.style.opacity = UI.maghrib_txt.style.opacity = opacityAlpha;
  UI.isha_arc.style.stroke = UI.isha_txt.style.stroke = UI.isha_txt.style.fill = "var(--highlight)";
  UI.isha_arc.style.opacity = UI.isha_txt.style.opacity = opacityAlpha;

  if (fajr < hours && hours < sunrise) {
    UI.fajr_arc.style.stroke = UI.fajr_txt.style.stroke = UI.fajr_txt.style.fill = "var(--secondary)";
    UI.fajr_arc.style.opacity = UI.isha_txt.style.opacity = 1;
  } else if (dhuhr < hours && hours < asr) {
    UI.dhuhr_arc.style.stroke = UI.dhuhr_txt.style.stroke = UI.dhuhr_txt.style.fill = "var(--secondary)";
    UI.dhuhr_arc.style.opacity = UI.dhuhr_txt.style.opacity = 1;
  } else if (asr < hours && hours < maghrib) {
    UI.asr_arc.style.stroke = UI.asr_txt.style.stroke = UI.asr_txt.style.fill = "var(--secondary)";
    UI.asr_arc.style.opacity = UI.asr_txt.style.opacity = 1;
  } else if (maghrib < hours && hours < isha) {
    UI.maghrib_arc.style.stroke = UI.maghrib_txt.style.stroke = UI.maghrib_txt.style.fill = "var(--secondary)";
    UI.maghrib_arc.style.opacity = UI.maghrib_txt.style.opacity = 1;
  } else if (isha < hours || hours < fajr) {
    UI.isha_arc.style.stroke = UI.isha_txt.style.stroke = UI.isha_txt.style.fill = "var(--secondary)";
    UI.isha_arc.style.opacity = UI.isha_txt.style.opacity = 1;
  }

  UI.prayer_tracker.setAttribute("transform", `translate(${prayerTackerCoordinates.x}, ${prayerTackerCoordinates.y})`)

  requestAnimationFrame(updateClock)
}

requestAnimationFrame(updateClock);
