import * as THREE from "three";

/**
 * Add comprehensive lighting setup to the scene
 * @param {THREE.Scene} scene - The Three.js scene
 */
export function addLighting(scene) {
  const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
  ambientLight.name = "ambient_light";
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
  mainLight.position.set(10, 10, 5);
  mainLight.castShadow = true;
  mainLight.name = "main_light";

  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  mainLight.shadow.camera.near = 0.5;
  mainLight.shadow.camera.far = 50;
  mainLight.shadow.camera.left = -10;
  mainLight.shadow.camera.right = 10;
  mainLight.shadow.camera.top = 10;
  mainLight.shadow.camera.bottom = -10;
  mainLight.shadow.bias = -0.0001;

  scene.add(mainLight);
  const fillLight = new THREE.DirectionalLight(0x4080ff, 0.5);
  fillLight.position.set(-8, 6, -8);
  fillLight.name = "fill_light";
  scene.add(fillLight);
  const rimLight = new THREE.DirectionalLight(0xff8040, 0.4);
  rimLight.position.set(0, -3, 12);
  rimLight.name = "rim_light";
  scene.add(rimLight);
  const spotLight = new THREE.SpotLight(0xffffff, 0.8);
  spotLight.position.set(5, 8, 3);
  spotLight.angle = Math.PI / 6;
  spotLight.penumbra = 0.3;
  spotLight.decay = 2;
  spotLight.distance = 20;
  spotLight.castShadow = true;
  spotLight.name = "spot_light";

  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 0.5;
  spotLight.shadow.camera.far = 20;

  scene.add(spotLight);
  createEnvironment(scene);
  addDynamicLighting(scene);
}

/**
 * Create environment elements (ground, background elements)
 * @param {THREE.Scene} scene - The Three.js scene
 */
function createEnvironment(scene) {
  const groundGeometry = new THREE.PlaneGeometry(20, 20);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.8,
    metalness: 0.1,
    transparent: true,
    opacity: 0.8,
  });

  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.1;
  ground.receiveShadow = true;
  ground.name = "ground";
  scene.add(ground);

  createBackgroundElements(scene);
}

/**
 * Create background geometric elements
 * @param {THREE.Scene} scene - The Three.js scene
 */
function createBackgroundElements(scene) {
  const backgroundGroup = new THREE.Group();
  backgroundGroup.name = "background_elements";
  const shapes = [
    { geometry: new THREE.TetrahedronGeometry(0.3), position: [-8, 3, -5] },
    { geometry: new THREE.OctahedronGeometry(0.2), position: [7, 4, -6] },
    { geometry: new THREE.IcosahedronGeometry(0.25), position: [-6, 2, -8] },
    { geometry: new THREE.DodecahedronGeometry(0.2), position: [5, 1, -7] },
  ];

  const backgroundMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.5,
    metalness: 0.7,
    transparent: true,
    opacity: 0.3,
  });

  shapes.forEach((shape, index) => {
    const mesh = new THREE.Mesh(shape.geometry, backgroundMaterial.clone());
    mesh.position.set(...shape.position);
    mesh.name = `background_shape_${index}`;
    backgroundGroup.add(mesh);

    // Add rotation animation
    mesh.userData.rotationSpeed = {
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02,
      z: (Math.random() - 0.5) * 0.02,
    };
  });

  scene.add(backgroundGroup);
  function animateBackground() {
    backgroundGroup.children.forEach((child) => {
      if (child.userData.rotationSpeed) {
        child.rotation.x += child.userData.rotationSpeed.x;
        child.rotation.y += child.userData.rotationSpeed.y;
        child.rotation.z += child.userData.rotationSpeed.z;
      }
    });
    requestAnimationFrame(animateBackground);
  }
  animateBackground();
}

/**
 * Add dynamic lighting effects
 * @param {THREE.Scene} scene - The Three.js scene
 */
function addDynamicLighting(scene) {
  const lights = [];
  scene.traverse((object) => {
    if (object.isDirectionalLight || object.isSpotLight) {
      lights.push(object);
    }
  });

  let time = 0;

  function animateLights() {
    time += 0.01;

    lights.forEach((light, index) => {
      if (light.name === "rim_light") {
        light.intensity = 0.4 + Math.sin(time + index) * 0.1;
      } else if (light.name === "fill_light") {
        light.intensity = 0.5 + Math.cos(time * 0.7 + index) * 0.1;
      }
    });

    requestAnimationFrame(animateLights);
  }
  animateLights();
}
