const Y_HIGH = 20; // y position of high voltage
const Y_LOW = 150; // y position of low voltate
const labelX = 10;
const valueX = 220;

let period = 200;
let dutyCycle = 0.5;
let showAverage = false;

function setup() {
  createCanvas(windowWidth, 400);

  let periodSlider = createSlider(10, 2000, period)
    .position(450, 80 + 230)
    .style('width', '300px');
  setControlCallback(periodSlider, (value) => {
    period = value;
    frequencySlider.value(1000000 / period);
  });

  let frequencySlider = createSlider(1000000 / 200, 1000000 / 10, 1000000 / period)
    .position(450, 80 + 330)
    .style('width', '300px');
  setControlCallback(frequencySlider, (value) => {
    period = 1000000 / value;
    periodSlider.value(period);
  });

  let dutyCycleSlider = createSlider(0, 1, dutyCycle, 0.01)
    .position(450, 80 + 280)
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
  control.elt.onmousemove = handler;
  control.elt.onchange = handler;
}

function draw() {
  background('white');

  // draw the graph
  const xPeriod = max(period / 2, 1);
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

  // draw the labels
  textSize(32);
  fill(0, 102, 153, 100);
  noStroke();
  text("Period:", labelX, 230);
  text("Duty Cycle:", labelX, 280);
  text("Frequency:", labelX, 330);
  fill(200, 25, 25, 100);
  text("Average:", labelX, 380);

  fill(0, 102, 153);
  text(formatNumber(period / 1000) + " ms", valueX, 230);
  text(Math.round(dutyCycle * 100) + "%", valueX, 280);
  text(Math.round(1000000 / period) + " Hz", valueX, 330);
  fill(200, 25, 25);
  text(formatNumber(dutyCycle * 5) + " V", valueX, 380);
}

const formatNumber = n => String(n).replace(/(\.\d{2})\d+/, '$1')
