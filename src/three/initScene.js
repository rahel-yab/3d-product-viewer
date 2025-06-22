import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Initialize the Three.js scene with camera, renderer, and controls
 * @param {HTMLCanvasElement} canvas - The canvas element to render to
 * @returns {Object} Scene configuration object
 */
export function initScene(canvas) {
  // Create the scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2a2a2a);
  scene.fog = new THREE.Fog(0x2a2a2a, 10, 50);

  // Create the camera
  const camera = new THREE.PerspectiveCamera(
    75, // field of view
    canvas.clientWidth / canvas.clientHeight, // aspect ratio
    0.1, // near clipping plane
    1000 // far clipping plane
  );

  // Position the camera
  camera.position.set(5, 3, 5);
  camera.lookAt(0, 0, 0);

  // Create the renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });

  // Configure renderer
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Enable shadows
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Color management
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  // Create orbit controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 2;
  controls.maxDistance = 20;
  controls.maxPolarAngle = Math.PI / 1.8; // Prevent going under the ground

  return {
    scene,
    camera,
    renderer,
    controls,
  };
}
