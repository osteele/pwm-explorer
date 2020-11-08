# PWM Explorer

An interactive visualization of Pulse Width Modulation (PWM).

![screenshot](docs/screenshot.png)

## Instructions

Drag the sliders to set the period, frequency, and duty cycle.

The period of a wave is the inverse of its frequency. Dragging one of these
sliders will move the other slider in the opposite direction.

Click the checkbox to control whether the average voltage is shown. This is the
voltage that a device with high reactance, such as a motor, will see.

The simulated servo at the top of the page moves at a speed that is proportional
to the average voltage.

## Related

[Map explorer](https://osteele.github.io/map-explorer/) visualizes the
Arduino / Processing / p5.js `map()` function.

The [PWM Explorer](https://github.com/osteele/arduino-pwm-explorer) project
controls the LED on an actual Arduino. It uses pots to control the frequency and
duty cycle, and sends this information to a Processing sketch that simulates an
oscilloscope view of the waveform.

## License

MIT
