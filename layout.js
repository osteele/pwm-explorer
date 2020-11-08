// Layout
const PWM_HIGH_Y = 20; // y position of high voltage
const PWM_LOW_Y = 150; // y position of low voltate
const PWM_STROKE_WIDTH = 2;

const IS_NARROW_WINDOW = window.innerWidth <= 400;

const LABEL_X = 10;
const VALUE_X = IS_NARROW_WINDOW ? 200 : 220;
const CONTROLS_X = IS_NARROW_WINDOW ? 10 : 450;

const LINE_HEIGHT = IS_NARROW_WINDOW ? 80 : 50;
const PERIOD_LABEL_Y = IS_NARROW_WINDOW ? 200 : 230;
const FREQUENCY_LABEL_Y = PERIOD_LABEL_Y + LINE_HEIGHT;
const DUTY_CYCLE_LABEL_Y = FREQUENCY_LABEL_Y + LINE_HEIGHT;
const SHOW_AVERAGE_LABEL_Y = DUTY_CYCLE_LABEL_Y + LINE_HEIGHT;
