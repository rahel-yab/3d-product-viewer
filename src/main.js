// Main application entry point
import { initScene } from "./three/initScene.js";
import { createProduct } from "./three/createProduct.js";
import { addLighting } from "./three/addLighting.js";
import { InteractionManager } from "./three/interaction.js";
import { CameraAnimator } from "./three/cameraAnimation.js";
import "./style.css";

class ProductViewer {
  constructor() {
    this.canvas = null;
    this.sceneConfig = null;
    this.productParts = [];
    this.interactionManager = null;
    this.cameraAnimator = null;
    this.isAutoRotating = true;

    this.init();
  }

  async init() {
    try {
      // Get canvas element
      this.canvas = document.getElementById("threejs-canvas");
      if (!this.canvas) {
        throw new Error("Canvas element not found");
      }

      // Initialize Three.js scene
      this.sceneConfig = initScene(this.canvas);

      // Add lighting to the scene
      addLighting(this.sceneConfig.scene);

      // Create the product (chair)
      this.productParts = createProduct(this.sceneConfig.scene);

      // Setup interaction manager
      this.interactionManager = new InteractionManager(
        this.sceneConfig.camera,
        this.productParts,
        this.handlePartSelect.bind(this)
      );

      // Setup camera animation
      this.cameraAnimator = new CameraAnimator(
        this.sceneConfig.camera,
        this.sceneConfig.controls
      );

      // Setup event listeners
      this.setupEventListeners();

      // Start animation loop
      this.animate();

      // Hide loading screen
      this.hideLoadingScreen();

      // Show part info panel
      this.showPartInfoPanel();
    } catch (error) {
      console.error("Failed to initialize 3D viewer:", error);
      this.showError(error.message);
    }
  }

  setupEventListeners() {
    // Window resize
    window.addEventListener("resize", this.handleResize.bind(this));

    // Mouse interactions
    this.canvas.addEventListener("mousemove", (event) => {
      this.interactionManager.handleMouseMove(event, this.canvas);
    });

    this.canvas.addEventListener("click", (event) => {
      this.interactionManager.handleClick(event, this.canvas);
    });

    // Control buttons
    const autoRotateBtn = document.getElementById("auto-rotate-btn");
    const resetBtn = document.getElementById("reset-btn");

    if (autoRotateBtn) {
      autoRotateBtn.addEventListener("click", this.toggleAutoRotate.bind(this));
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", this.resetView.bind(this));
    }

    // Pause auto-rotation when user interacts with controls
    if (this.sceneConfig.controls) {
      this.sceneConfig.controls.addEventListener("start", () => {
        this.cameraAnimator.pauseAutoRotation();
      });

      this.sceneConfig.controls.addEventListener("end", () => {
        setTimeout(() => {
          if (this.isAutoRotating) {
            this.cameraAnimator.resumeAutoRotation();
          }
        }, 2000); // Resume after 2 seconds of no interaction
      });
    }
  }

  handleResize() {
    if (!this.sceneConfig || !this.canvas) return;

    const { camera, renderer } = this.sceneConfig;

    // Update camera aspect ratio
    camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  handlePartSelect(part) {
    const partNameEl = document.getElementById("part-name");
    const partDescEl = document.getElementById("part-description");

    if (part) {
      if (partNameEl) partNameEl.textContent = part.name;
      if (partDescEl) partDescEl.textContent = part.description;
    } else {
      if (partNameEl) partNameEl.textContent = "Select a Part";
      if (partDescEl)
        partDescEl.textContent =
          "Hover over or click on different parts of the chair to see detailed information.";
    }
  }

  toggleAutoRotate() {
    this.isAutoRotating = !this.isAutoRotating;
    const btn = document.getElementById("auto-rotate-btn");

    if (this.isAutoRotating) {
      this.cameraAnimator.resumeAutoRotation();
      if (btn) btn.textContent = "Auto Rotate: ON";
    } else {
      this.cameraAnimator.pauseAutoRotation();
      if (btn) btn.textContent = "Auto Rotate: OFF";
    }
  }

  resetView() {
    if (this.sceneConfig && this.sceneConfig.controls) {
      this.sceneConfig.controls.reset();
      this.cameraAnimator.reset();
    }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    if (this.sceneConfig) {
      // Update camera animation
      this.cameraAnimator.update();

      // Update controls
      if (this.sceneConfig.controls) {
        this.sceneConfig.controls.update();
      }

      // Update interactions
      this.interactionManager.update();

      // Render the scene
      this.sceneConfig.renderer.render(
        this.sceneConfig.scene,
        this.sceneConfig.camera
      );
    }
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 500);
    }
  }

  showPartInfoPanel() {
    const panel = document.getElementById("part-info-panel");
    if (panel) {
      setTimeout(() => {
        panel.style.opacity = "1";
        panel.style.transform = "translateY(0)";
      }, 1000);
    }
  }

  showError(message) {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.innerHTML = `
        <div class="text-center">
          <div class="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 class="text-white text-xl mb-2">Error Loading 3D Viewer</h2>
          <p class="text-gray-300">${message}</p>
        </div>
      `;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ProductViewer();
});
