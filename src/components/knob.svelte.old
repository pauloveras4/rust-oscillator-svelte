<script>
  import { onMount } from "svelte";

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

  onMount(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  });
</script>

<style>
  .knob {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
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

<div
    class="knob"
    on:mousedown={onMouseDown}
    on:wheel={onScroll}
    style="--angle: {valueToAngle(value)};"
    >
      <div class="knob-image"></div>
</div>
