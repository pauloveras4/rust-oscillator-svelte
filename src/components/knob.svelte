<script>
  // Props
  export let value = 1000;
  export let minValue = 0;
  export let maxValue = 2000;
  export let step = 10;

  let isDragging = false;
  let lastY = 0;

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function valueToAngle(value) {
    const normalized = (value - minValue) / (maxValue - minValue);
    return normalized * 270 - 95;
  }

  function angleToValue(angle) {
    const normalized = (angle + 135) / 270;
    return clamp(normalized * (maxValue - minValue) + minValue, minValue, maxValue);
  }


  function onMouseDown(event) {
    isDragging = true;
    lastY = event.clientY;
    event.preventDefault();
  }

  function onMouseMove(event) {
    if (isDragging) {
      const deltaY = lastY - event.clientY;
      const angleChange = deltaY * (270 / (maxValue - minValue));
      const newAngle = valueToAngle(value) + angleChange;
      value = clamp(angleToValue(newAngle), minValue, maxValue);
      lastY = event.clientY;
    }
  }

  function onMouseUp() {
    isDragging = false;
  }

  function onScroll(event) {
    value = clamp(value + (event.deltaY > 0 ? -step : step), minValue, maxValue);
    event.preventDefault();
  }
</script>

  <style>
  .knob-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  
  .knob {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor:pointer;
    user-select: none;
    position: relative;
  }

  .knob-image {
    width: 100%;
    height: 100%;
    background: url('/knob.png') no-repeat center;
    background-size: contain;
    transform: rotate(calc((var(--angle)) * 1deg)); 
    transform-origin: center center;
  }
</style>
<div class="knob-container">
<div
    class="knob"
    on:mousedown={onMouseDown}
    on:mousemove={onMouseMove}
    on:mouseup={onMouseUp}
    on:mouseleave={onMouseUp}
    on:wheel={onScroll}
    style="--angle: {valueToAngle(value)};"
    >
      <div class="knob-image"></div>
</div>
</div>
