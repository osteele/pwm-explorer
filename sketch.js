const Y_HIGH = 20;
const Y_LOW = 150;
const labelX = 10;
const valueX = 260;

let periodSlider;
let dutyCycleSlider;

function setup() {
  createCanvas(windowWidth, 350);

  periodSlider = createSlider(1, 1000, 200)
    .position(450, 80 + 230)
    .style('width', '300px');
  periodSlider.elt.onchange = redraw;
  periodSlider.elt.onmousemove = redraw;

  dutyCycleSlider = createSlider(0.01, 1, 0.5, 0.01)
    .position(450, 80 + 280)
    .style('width', '300px');
  dutyCycleSlider.elt.onchange = redraw;
  dutyCycleSlider.elt.onmousemove = redraw;

  redraw();
}

function draw() {
  background(255);

  const period = periodSlider.value();
  const dutyCycle = dutyCycleSlider.value();
  const xPeriod = max(period / 2, 1);

  // draw the graph
  let x = 0;

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
  textSize(32);
  fill(0, 102, 153, 100);
  text("Period:", labelX, 230);
  text("Duty Cycle:", labelX, 280);
  text("Frequency:", labelX, 330);
  fill(0, 102, 153);
  text(formatNumber(period / 1000) + " ms", valueX, 230);
  text(Math.round(dutyCycle * 100) + "%", valueX, 280);
  text(Math.round(1000000 / period) + " Hz", valueX, 330);
}

const formatNumber = n => String(n).replace(/(\.\d{2})\d+/, '$1')
