// Layout
const IS_NARROW_WINDOW = window.innerWidth <= 400;

const PWM_HIGH_Y = 20;
const PWM_LOW_Y = 150;

const _VALUE_X = IS_NARROW_WINDOW ? 200 : 220;
const _CONTROLS_X = IS_NARROW_WINDOW ? 10 : 450;

const _LINE_HEIGHT = IS_NARROW_WINDOW ? 80 : 50;
const _PERIOD_LABEL_Y = IS_NARROW_WINDOW ? 200 : 230;
const _FREQUENCY_LABEL_Y = _PERIOD_LABEL_Y + _LINE_HEIGHT;
const _DUTY_CYCLE_LABEL_Y = _FREQUENCY_LABEL_Y + _LINE_HEIGHT;
const _SHOW_AVERAGE_LABEL_Y = _DUTY_CYCLE_LABEL_Y + _LINE_HEIGHT;

const SERVO_X = 50;
const SERVO_Y = -20;

const layout = {
    // y positions of low and high voltage
    pwmHighY: 20,
    pwmLowY: 150,

    labelX: 10,
    valueX: _VALUE_X,
    controlsX: _CONTROLS_X,

    lineHeight: _LINE_HEIGHT,
    periodLabelY: _PERIOD_LABEL_Y,
    frequencyLabelY: _FREQUENCY_LABEL_Y,
    dutyCycleLabelY: _DUTY_CYCLE_LABEL_Y,
    showAverageLabelY: _SHOW_AVERAGE_LABEL_Y,
}
