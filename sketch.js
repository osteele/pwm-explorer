const MS_PER_SECOND = 1000;
const SERVO_MAX_RPMS = 20;

const PWM_FILL_COLOR = '#0066BB80';
const PWM_STROKE_COLOR = '#0066BB';
const PWM_STROKE_WIDTH = 2;

// model options
let period = 0.2; // in ms
let dutyCycle = 0.5;

// display options
let showAverageVoltage = false;

// simulation state
let prevMillis;
let servoAngle = 0;

function preload() {
  servoImage = loadImage("assets/servo-fan.png");
}

function setup() {
  calculateLayout();
  createCanvas(windowWidth, layout.headerHeight + layout.showAverageLabelY + 50);

  const x = layout.controlsX;
  const dy = layout.controlOffsetY;
  const periodSlider = createSlider(.01, 2, period, 0.01)
    .position(x, layout.periodLabelY + dy)
  setControlCallback(periodSlider, (value) => {
    period = value;
    frequencySlider.value(MS_PER_SECOND / period);
  });

  const frequencySlider = createSlider(MS_PER_SECOND / 2, MS_PER_SECOND / .01, MS_PER_SECOND / period)
    .position(x, layout.frequencyLabelY + dy)
  setControlCallback(frequencySlider, (value) => {
    period = MS_PER_SECOND / value;
    periodSlider.value(period);
  });

  const dutyCycleSlider = createSlider(0, 1, dutyCycle, 0.01)
    .position(x, layout.dutyCycleLabelY + dy)
  setControlCallback(dutyCycleSlider, (value) => dutyCycle = value);

  const showAverageCheckbox = createCheckbox('Show').class('show-average')
    .position(x, layout.showAverageLabelY + dy - 8)
  setControlCallback(showAverageCheckbox, () => {
    showAverageVoltage = showAverageCheckbox.checked();
  });

  prevMillis = millis();
}

function setControlCallback(control, valueSetter) {
  function handler() {
    valueSetter(control.value());
    redraw();
  }
  control.elt.onchange = handler;
  control.elt.onmousemove = (e) => { if (e.buttons) handler(); }
  control.elt.ontouchmove = handler;
}

function draw() {
  clear();

  push();
  translate(0, layout.headerHeight);
  scope();
  labels();
  pop();

  servo();
}

function scope() {
  const PWM_HIGH_Y = layout.pwmHighY;
  const PWM_LOW_Y = layout.pwmLowY;
  const xPeriod = dutyCycle === 1 ? width : max(MS_PER_SECOND * period / 2, 1);

  fill(PWM_FILL_COLOR);
  noStroke();
  beginShape();
  let x = -1;
  vertex(x, PWM_LOW_Y);
  while (x < width) {
    let x1 = x + xPeriod * dutyCycle;
    let x2 = x + xPeriod;
    if (dutyCycle > 0) {
      vertex(x, PWM_HIGH_Y);
      vertex(x1, PWM_HIGH_Y);
      rect(x, PWM_HIGH_Y, x1 - x, PWM_LOW_Y - PWM_HIGH_Y)
    }
    vertex(x1, PWM_LOW_Y - PWM_STROKE_WIDTH / 2);
    vertex(x2, PWM_LOW_Y - PWM_STROKE_WIDTH / 2);
    x = x2;
  }
  noFill();
  stroke(PWM_STROKE_COLOR);
  strokeWeight(PWM_STROKE_WIDTH);
  endShape();

  if (showAverageVoltage) {
    const c = lerpColor(color('black'), color('red'), dutyCycle)
    const [r, g, b] = c.levels;
    const y = lerp(PWM_LOW_Y, PWM_HIGH_Y, dutyCycle);
    noStroke();
    fill(r, g, b, 100);
    rect(0, y, width, PWM_LOW_Y - y);
    noFill();
    stroke(r, g, b, 200);
    strokeWeight(4);
    line(0, y, width, y);
  }
}

function servo() {
  const curMillis = millis();
  servoAngle += SERVO_MAX_RPMS * dutyCycle * (curMillis - prevMillis) / MS_PER_SECOND;
  prevMillis = curMillis;

  const elt = document.getElementById("servo-animation");
  translate(elt.offsetLeft + elt.offsetWidth / 2, elt.offsetTop + elt.offsetHeight / 2);
  scale(elt.offsetWidth / servoImage.width);
  imageMode(CENTER);

  // const prevAngle = servoAngle;
  // console.info('from', prevAngle, 'to', servoAngle, 'in', (servoAngle - prevAngle) / 0.1)
  // for (let angle = prevAngle; (angle += 0.1) < servoAngle;) {
  //   push();
  //   rotate(angle);
  //   // tint(255, 0, 0, 20);
  //   tint(255, 128)
  //   image(servoImage, 0, 0);
  //   pop();
  // }

  rotate(servoAngle);
  image(servoImage, 0, 0);
}

function labels() {
  // labels
  {
    const x = layout.labelX;
    textSize(32);
    fill(0, 102, 153, 100);
    noStroke();
    text("Period:", x, layout.periodLabelY);
    text("Frequency:", x, layout.frequencyLabelY);
    text("Duty Cycle:", x, layout.dutyCycleLabelY);
    fill(200, 25, 25, 100);
    text("Average:", x, layout.showAverageLabelY);
  }

  // values
  {
    const frequency = MS_PER_SECOND / period;
    const x = layout.valueX;
    fill(0, 102, 153);
    text(`${formatNumber(period)} ms`, x, layout.periodLabelY);
    text(`${Math.round(frequency)} Hz`, x, layout.frequencyLabelY);
    text(`${Math.round(dutyCycle * 100)}%`, x, layout.dutyCycleLabelY);
    fill(200, 25, 25);
    text(`${formatNumber(dutyCycle * 5)} V`, x, layout.showAverageLabelY);
  }
}

const formatNumber = n =>
  String(n).replace(/(\.\d{2})\d+/, '$1');

function rotateAbout(angle, x, y) {
  translate(x, y);
  rotate(angle);
  translate(-x, -y);
}
