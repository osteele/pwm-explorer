// Layout
const PWM_HIGH_Y = 20; // y position of high voltage
const PWM_LOW_Y = 150; // y position of low voltate
const PWM_STROKE_WIDTH = 2;

const narrow = window.innerWidth <= 900;

const LABEL_X = 10;
const VALUE_X = narrow ? 200 : 220;
const CONTROLS_X = narrow ? 10 : 450;

const LINE_HEIGHT = narrow ? 80 : 50;
const PERIOD_LABEL_Y = narrow ? 200 : 230;
const FREQUENCY_LABEL_Y = PERIOD_LABEL_Y + LINE_HEIGHT;
const DUTY_CYCLE_LABEL_Y = FREQUENCY_LABEL_Y + LINE_HEIGHT;
const SHOW_AVERAGE_LABEL_Y = DUTY_CYCLE_LABEL_Y + LINE_HEIGHT;

const PWM_FILL_COLOR = '#0066BBA0';
const PWM_STROKE_COLOR = '#0066BB';

const msPerSecond = 1000;

let period = 0.2; // in ms
let dutyCycle = 0.5;
let showAverage = false;

function setup() {
  createCanvas(windowWidth, SHOW_AVERAGE_LABEL_Y + 50);

  const controlOffsetY = document.getElementsByTagName('canvas')[0].offsetTop - 18
    + (narrow ? 25 : 0);

  let periodSlider = createSlider(.01, 2, period, 0.01)
    .position(CONTROLS_X, controlOffsetY + PERIOD_LABEL_Y)
    .style('width', '300px');
  setControlCallback(periodSlider, (value) => {
    period = value;
    frequencySlider.value(msPerSecond / period);
  });

  let frequencySlider = createSlider(msPerSecond / 2, msPerSecond / .01, msPerSecond / period)
    .position(CONTROLS_X, controlOffsetY + FREQUENCY_LABEL_Y)
    .style('width', '300px');
  setControlCallback(frequencySlider, (value) => {
    period = msPerSecond / value;
    periodSlider.value(period);
  });

  let dutyCycleSlider = createSlider(0, 1, dutyCycle, 0.01)
    .position(CONTROLS_X, controlOffsetY + DUTY_CYCLE_LABEL_Y)
    .style('width', '300px');
  setControlCallback(dutyCycleSlider, (value) => dutyCycle = value);

  let showAverageCheckbox = createCheckbox('Show').class('show-average')
    .position(CONTROLS_X, controlOffsetY + SHOW_AVERAGE_LABEL_Y - 8)
  setControlCallback(showAverageCheckbox, () => {
    s
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
  control.elt.onmousemove = (e) => { if (e.buttons) handler(); }
  control.elt.ontouchmove = handler;
}

function draw() {
  background('white');

  // draw the graph
  const xPeriod = dutyCycle === 1 ? width : max(msPerSecond * period / 2, 1);
  fill(PWM_FILL_COLOR);
  noStroke();
  beginShape();
  let x = 0;
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

  if (showAverage) {
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
