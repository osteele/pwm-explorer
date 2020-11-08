// Layout
const IS_NARROW_WINDOW = window.innerWidth <= 400;
const SERVO_X = 50;
const SERVO_Y = -20;

let layout;

function calculateLayout() {
  const valueX = IS_NARROW_WINDOW ? 200 : 220;
  const controlsX = IS_NARROW_WINDOW ? 10 : 450;

  const lineHeight = IS_NARROW_WINDOW ? 80 : 50;
  const periodLabelY = IS_NARROW_WINDOW ? 200 : 230;
  const frequencyLabelY = periodLabelY + lineHeight;
  const dutyCycleLabelY = frequencyLabelY + lineHeight;
  const showAverageLabelY = dutyCycleLabelY + lineHeight;

  layout = {
    // y positions of low and high voltage
    pwmHighY: 20,
    pwmLowY: 150,

    labelX: 10,
    valueX,
    controlsX,

    lineHeight,
    periodLabelY,
    frequencyLabelY,
    dutyCycleLabelY,
    showAverageLabelY,
  };
}
