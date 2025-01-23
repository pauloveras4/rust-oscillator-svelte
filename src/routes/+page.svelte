<script lang="ts">
  import { onMount } from 'svelte';
  import init, { generate_wave } from '$lib/rust-generate-wave/rust_generate_wave.js';
  import Knob from '../components/knob.svelte';

  let frequency = 0; // Starting frequency (default A4 note)
  let duration = 0;    // Duration of the tone
  let isPlaying = false; // Flag to track if sound is playing
  let audioCtx: AudioContext; // Audio context for audio playback
  let bufferSource: AudioBufferSourceNode | null = null; // Audio source node to play the buffer

  (async () => {
  try {
    await init();
  } catch (error) {
    console.error('Error', error);
    }
    })();

  // Initialize AudioContext and WebAssembly module
  onMount(async () => {
   audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    console.log("Audio Context initialized");
  });

  // Create and play sound based on the current frequency and duration
  function createAndPlaySound() {
    // Stop the current sound if playing
    if (bufferSource) {
      bufferSource.stop();
      bufferSource.disconnect();
    }

    // Generate wave data using Rust WebAssembly
    const samples = generate_wave(frequency, duration);
    console.log(samples);
    const buffer = audioCtx.createBuffer(1, samples.length, 44100);
    buffer.copyToChannel(new Float32Array(samples), 0);

    // Create a new AudioBufferSourceNode with the new buffer
    bufferSource = audioCtx.createBufferSource();
    bufferSource.buffer = buffer;
    bufferSource.connect(audioCtx.destination);
    bufferSource.start();

    // Set up onended event listener
    bufferSource.onended = () => {
      console.log("Sound ended");
      isPlaying = false;
    };

    // Mark that sound is now playing
    isPlaying = true;
  }

  // Start or stop the sound based on the isPlaying flag
  function playStopSound() {
    if (isPlaying) {
      stopSound(); // Stop the sound
    } else {
      createAndPlaySound(); // Create and play the sound
    }
  }

  // Stop the sound
  function stopSound() {
    if (bufferSource) {
      bufferSource.stop();
      bufferSource.disconnect();
      bufferSource = null;
      isPlaying = false;
    }
  }

  // Reactively play the sound when frequency changes
  $: if (isPlaying) {
    stopSound(); // Stop the current sound if it's playing
    createAndPlaySound(); // Create and play a new sound with updated frequency
  }
</script>

<main>
  <h1>Rust-Powered Oscillator</h1>
<!--
  <div>
    <label>Frequency: {frequency} Hz</label>
    <input type="range" min="20" max="2000" step="1" bind:value={frequency} />
  </div>
-->
  <Knob bind:value={frequency} minValue={0} maxValue={2000} step={10} />
  <p> Freq: {frequency} Hz</p>

  <Knob bind:value={duration} minValue={1} maxValue={5} step={1} />
  <p> Duration: {duration} seconds</p>

  <button on:click={playStopSound} disabled={isPlaying}>
    {isPlaying ? "Stop" : "Play"}
  </button>
</main>

<style>
  main {
    text-align: center;
    margin-top: 50px;
  }

  input[type="range"] {
    width: 300px;
  }
</style>
