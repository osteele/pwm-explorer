const PWM_FILL_COLOR = '#0066BB80';
const PWM_STROKE_COLOR = '#0066BB';

const MS_PER_SECOND = 1000;

let headerHeight;

let period = 0.2; // in ms
let dutyCycle = 0.5;
let showAverageVoltage = false;

let prevMillis;
let servoAngle = 0;

function preload() {
  servoImage = loadImage("assets/servo-fan.png");
}

function setup() {
  const header = document.getElementById("header");
  headerHeight = header.offsetTop + header.offsetHeight;
  createCanvas(windowWidth, headerHeight + SHOW_AVERAGE_LABEL_Y + 50);

  const controlOffsetY = headerHeight - 18 + (IS_NARROW_WINDOW ? 25 : 0);

  const periodSlider = createSlider(.01, 2, period, 0.01)
    .position(CONTROLS_X, controlOffsetY + PERIOD_LABEL_Y)
  setControlCallback(periodSlider, (value) => {
    period = value;
    frequencySlider.value(MS_PER_SECOND / period);
  });

  const frequencySlider = createSlider(MS_PER_SECOND / 2, MS_PER_SECOND / .01, MS_PER_SECOND / period)
    .position(CONTROLS_X, controlOffsetY + FREQUENCY_LABEL_Y)
  setControlCallback(frequencySlider, (value) => {
    period = MS_PER_SECOND / value;
    periodSlider.value(period);
  });

  const dutyCycleSlider = createSlider(0, 1, dutyCycle, 0.01)
    .position(CONTROLS_X, controlOffsetY + DUTY_CYCLE_LABEL_Y)
  setControlCallback(dutyCycleSlider, (value) => dutyCycle = value);

  const showAverageCheckbox = createCheckbox('Show').class('show-average')
    .position(CONTROLS_X, controlOffsetY + SHOW_AVERAGE_LABEL_Y - 8)
  setControlCallback(showAverageCheckbox, () => {
    showAverageVoltage = showAverageCheckbox.checked();
  });

  prevMillis = millis();
  // noLoop();
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

  translate(0, headerHeight);
  scope();
  labels();
  servo();
}

function scope() {
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
  const SERVO_X = 50;
  const SERVO_Y = -20;
  const SERVO_MAX_RPMS = 20;

  const curMillis = millis();
  const prevAngle = servoAngle;
  servoAngle += SERVO_MAX_RPMS * dutyCycle * (curMillis - prevMillis) / MS_PER_SECOND;
  prevMillis = curMillis;

  translate(SERVO_X, SERVO_Y);
  imageMode(CENTER);
  scale(1 / 9);

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
  textSize(32);
  fill(0, 102, 153, 100);
  noStroke();
  text("Period:", LABEL_X, PERIOD_LABEL_Y);
  text("Frequency:", LABEL_X, FREQUENCY_LABEL_Y);
  text("Duty Cycle:", LABEL_X, DUTY_CYCLE_LABEL_Y);
  fill(200, 25, 25, 100);
  text("Average:", LABEL_X, SHOW_AVERAGE_LABEL_Y);

  // values
  const frequency = MS_PER_SECOND / period;
  fill(0, 102, 153);
  text(`${formatNumber(period)} ms`, VALUE_X, PERIOD_LABEL_Y);
  text(`${Math.round(frequency)} Hz`, VALUE_X, FREQUENCY_LABEL_Y);
  text(`${Math.round(dutyCycle * 100)}%`, VALUE_X, DUTY_CYCLE_LABEL_Y);
  fill(200, 25, 25);
  text(`${formatNumber(dutyCycle * 5)} V`, VALUE_X, SHOW_AVERAGE_LABEL_Y);
}

const formatNumber = n =>
  String(n).replace(/(\.\d{2})\d+/, '$1');

function rotateAbout(angle, x, y) {
  translate(x, y);
  rotate(angle);
  translate(-x, -y);
}
