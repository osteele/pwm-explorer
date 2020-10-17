// Layout
const Y_HIGH = 20; // y position of high voltage
const Y_LOW = 150; // y position of low voltate
const LABEL_X = 10;
const VALUE_X = 220;
const CONTROLS_X = 450;
const HEADER_HEIGHT = 80;
const PERIOD_LABEL_Y = 230;
const FREQUENCY_LABEL_Y = PERIOD_LABEL_Y + 50;
const DUTY_CYCLE_LABEL_Y = FREQUENCY_LABEL_Y + 50;
const SHOW_AVERAGE_LABEL_Y = DUTY_CYCLE_LABEL_Y + 50;

const PWM_FILL_COLOR = '#0066BBA0';
const PWM_STROKE_COLOR = '#0066BB';

const msPerSecond = 1000;

let period = 0.2; // in ms
let dutyCycle = 0.5;
let showAverage = false;

function setup() {
  createCanvas(windowWidth, 400);

  let periodSlider = createSlider(.01, 2, period, 0.01)
    .position(CONTROLS_X, HEADER_HEIGHT + PERIOD_LABEL_Y)
    .style('width', '300px');
  setControlCallback(periodSlider, (value) => {
    period = value;
    frequencySlider.value(msPerSecond / period);
  });

  let frequencySlider = createSlider(msPerSecond / 2, msPerSecond / .01, msPerSecond / period)
    .position(CONTROLS_X, HEADER_HEIGHT + FREQUENCY_LABEL_Y)
    .style('width', '300px');
  setControlCallback(frequencySlider, (value) => {
    period = msPerSecond / value;
    periodSlider.value(period);
  });

  let dutyCycleSlider = createSlider(0, 1, dutyCycle, 0.01)
    .position(CONTROLS_X, HEADER_HEIGHT + DUTY_CYCLE_LABEL_Y)
    .style('width', '300px');
  setControlCallback(dutyCycleSlider, (value) => {
    dutyCycle = value;
  });

  let showAverageCheckbox = createCheckbox('Show').class('show-average')
    .position(CONTROLS_X, HEADER_HEIGHT + SHOW_AVERAGE_LABEL_Y - 10)
  setControlCallback(showAverageCheckbox, () => {
    showAverage = showAverageCheckbox.checked();
  });

  noLoop();
}

function setControlCallback(control, valueSetter) {
  function handler() {
    valueSetter(control.value());
    redraw();
  }
  control.elt.onchange = handler;
  control.elt.onmousemove = handler;
}

function draw() {
  background('white');

  // draw the graph
  const xPeriod = max(msPerSecond * period / 2, 1);
  fill(PWM_FILL_COLOR);
  noStroke();
  beginShape();
  let x = 0;
  vertex(x, Y_LOW);
  while (x < width) {
    let x1 = x + xPeriod * dutyCycle;
    let x2 = x + xPeriod;
    if (dutyCycle > 0) {
      vertex(x, Y_HIGH);
      vertex(x1, Y_HIGH);
      rect(x, Y_HIGH, x1 - x, Y_LOW - Y_HIGH)
    }
    vertex(x1, Y_LOW - 1);
    vertex(x2, Y_LOW - 1);
    x = x2;
  }
  noFill();
  stroke(PWM_STROKE_COLOR);
  strokeWeight(2);
  endShape();

  if (showAverage) {
    const c = lerpColor(color('black'), color('red'), dutyCycle)
    const [r, g, b] = c.levels;
    const y = lerp(Y_LOW, Y_HIGH, dutyCycle);
    noStroke();
    fill(r, g, b, 100);
    rect(0, y, width, Y_LOW - y);
    noFill();
    stroke(r, g, b, 200);
    strokeWeight(4);
    line(0, y, width, y);
  }

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
  const frequency = msPerSecond / period;
  fill(0, 102, 153);
  text(`${formatNumber(period)} ms`, VALUE_X, PERIOD_LABEL_Y);
  text(`${Math.round(frequency)} Hz`, VALUE_X, FREQUENCY_LABEL_Y);
  text(`${Math.round(dutyCycle * 100)}%`, VALUE_X, DUTY_CYCLE_LABEL_Y);
  fill(200, 25, 25);
  text(`${formatNumber(dutyCycle * 5)} V`, VALUE_X, SHOW_AVERAGE_LABEL_Y);
}

const formatNumber = n =>
  String(n).replace(/(\.\d{2})\d+/, '$1');
