let periodSlider;
let dutyCycleSlider;

// let lastMillis = 0;

function setup() {
  createCanvas(800, 350);

  createDiv('Period').class('label')
  periodSlider = createSlider(1, 1000, 200);
  // periodSlider.elt.onchange = redraw;

  createDiv('Duty Cycle').class('label')
  dutyCycleSlider = createSlider(0.01, 1, 0.5, 0.01);
  // dutyCycleSlider.elt.onchange = redraw;

  // noLoop();
}

function draw() {
  let period = periodSlider.value();
  let dutyCycle = dutyCycleSlider.value();

  let xPeriod = period / 2;
  console.info(period, xPeriod, dutyCycle)

  background(255);

  // draw the graph
  let x = 0;
  const Y_HIGH = 20;
  const Y_LOW = 150;

  beginShape();
  vertex(x, Y_LOW);
  while (x < width) {
    let x1 = x + xPeriod * dutyCycle;
    let x2 = x + xPeriod;
    vertex(x, Y_HIGH);
    vertex(x1, Y_HIGH);
    vertex(x1, Y_LOW);
    vertex(x2, Y_LOW);
    x = x2;
  }
  endShape(CLOSE);

  // draw the labels
  let xLabels = 10;
  let xValues = 260;
  textSize(32);
  fill(0, 102, 153, 100);
  text("Period:", xLabels, 230);
  text("Duty Cycle:", xLabels, 280);
  text("Frequency:", xLabels, 330);
  fill(0, 102, 153);
  text(period / 1000.0 + " ms", xValues, 230);
  text(dutyCycle * 100 + "%", xValues, 280);
  text(1000000.0 / period + " Hz", xValues, 330);
}
