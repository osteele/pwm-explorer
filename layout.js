let layout;

function calculateLayout() {
  const windowIsNarrow = window.innerWidth <= 400;
  const header = document.getElementById("header");
  const headerHeight = header.offsetTop + header.offsetHeight;

  const valueX = windowIsNarrow ? 200 : 220;
  const controlsX = windowIsNarrow ? 10 : 450;
  const lineHeight = windowIsNarrow ? 80 : 50;
  const firstLabelY = windowIsNarrow ? 200 : 230;

  layout = {
    headerHeight,
    controlOffsetY: headerHeight - 18 + (windowIsNarrow ? 25 : 0),

    // y positions of low and high voltage
    pwmHighY: 20,
    pwmLowY: 150,

    labelX: 10,
    valueX,
    controlsX,

    lineHeight,
    periodLabelY: firstLabelY,
    frequencyLabelY: firstLabelY + lineHeight,
    dutyCycleLabelY: firstLabelY + 2 * lineHeight,
    showAverageLabelY: firstLabelY + 3 * lineHeight,
  };
}
