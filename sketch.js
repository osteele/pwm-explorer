const Y_HIGH = 20; // y position of high voltage
const Y_LOW = 150; // y position of low voltate
const labelX = 10;
const valueX = 220;

const msPerSecond = 1000;

let period = 0.2; // in ms
let dutyCycle = 0.5;
let showAverage = false;

function setup() {
  createCanvas(windowWidth, 400);

  let periodSlider = createSlider(.01, 2, period, 0.01)
    .position(450, 80 + 230)
    .style('width', '300px');
  setControlCallback(periodSlider, (value) => {
    period = value;
    frequencySlider.value(msPerSecond / period);
  });

  let frequencySlider = createSlider(msPerSecond / 2, msPerSecond / .01, msPerSecond / period)
    .position(450, 80 + 280)
    .style('width', '300px');
  setControlCallback(frequencySlider, (value) => {
    period = msPerSecond / value;
    periodSlider.value(period);
  });

  let dutyCycleSlider = createSlider(0, 1, dutyCycle, 0.01)
    .position(450, 80 + 330)
    .style('width', '300px');
  setControlCallback(dutyCycleSlider, (value) => {
    dutyCycle = value;
  });

  let showAverageCheckbox = createCheckbox('Show').class('show-average')
    .position(450, 80 + 380 - 10)
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
  fill(0, 102, 153);
  stroke(0, 102, 153);
  strokeWeight(1);
  beginShape();
  let x = 0;
  vertex(x, Y_LOW);
  while (x < width) {
    let x1 = x + xPeriod * dutyCycle;
    let x2 = x + xPeriod;
    if (dutyCycle > 0) {
      vertex(x, Y_HIGH);
      vertex(x1, Y_HIGH);
    }
    vertex(x1, Y_LOW);
    vertex(x2, Y_LOW);
    x = x2;
  }
  endShape(CLOSE);

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
  text("Period:", labelX, 230);
  text("Frequency:", labelX, 280);
  text("Duty Cycle:", labelX, 330);
  fill(200, 25, 25, 100);
  text("Average:", labelX, 380);

  // values
  const frequency = msPerSecond / period;
  fill(0, 102, 153);
  text(`${formatNumber(period)} ms`, valueX, 230);
  text(`${Math.round(frequency)} Hz`, valueX, 280);
  text(`${Math.round(dutyCycle * 100)}%`, valueX, 330);
  fill(200, 25, 25);
  text(`${formatNumber(dutyCycle * 5)} V`, valueX, 380);
}

const formatNumber = n =>
  String(n).replace(/(\.\d{2})\d+/, '$1');
