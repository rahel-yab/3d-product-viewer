import * as THREE from "three";

/**
 * Manages mouse interactions and raycasting for the 3D scene
 */
export class InteractionManager {
  constructor(camera, productParts, onPartSelect) {
    this.camera = camera;
    this.productParts = productParts;
    this.onPartSelect = onPartSelect;

    // Raycasting setup
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Interaction state
    this.hoveredPart = null;
    this.selectedPart = null;
    this.highlightedMeshes = new Set();

    // Visual feedback materials
    this.createFeedbackMaterials();

    // Animation properties
    this.animationMixers = [];
    this.clock = new THREE.Clock();
  }

  /**
   * Create materials for visual feedback
   */
  createFeedbackMaterials() {
    this.hoverMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      emissive: 0x002211,
      roughness: 0.3,
      metalness: 0.7,
      transparent: true,
      opacity: 0.8,
    });

    this.selectedMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6644,
      emissive: 0x221100,
      roughness: 0.3,
      metalness: 0.7,
      transparent: true,
      opacity: 0.9,
    });
  }

  /**
   * Handle mouse movement for hover effects
   * @param {MouseEvent} event - Mouse event
   * @param {HTMLCanvasElement} canvas - Canvas element
   */
  handleMouseMove(event, canvas) {
    const rect = canvas.getBoundingClientRect();

    // Convert mouse coordinates to normalized device coordinates
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Get intersections
    const meshes = this.productParts.map((part) => part.mesh);
    const intersects = this.raycaster.intersectObjects(meshes);

    // Handle hover effects
    if (intersects.length > 0) {
      const intersectedMesh = intersects[0].object;
      const part = this.productParts.find((p) => p.mesh === intersectedMesh);

      if (part && part !== this.hoveredPart) {
        this.handleHover(part);
      }

      // Change cursor
      canvas.style.cursor = "pointer";
    } else {
      if (this.hoveredPart) {
        this.clearHover();
      }
      canvas.style.cursor = "default";
    }
  }

  /**
   * Handle mouse click for selection
   * @param {MouseEvent} event - Mouse event
   * @param {HTMLCanvasElement} canvas - Canvas element
   */
  handleClick(event, canvas) {
    const rect = canvas.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const meshes = this.productParts.map((part) => part.mesh);
    const intersects = this.raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const intersectedMesh = intersects[0].object;
      const part = this.productParts.find((p) => p.mesh === intersectedMesh);

      if (part) {
        this.handleSelection(part);
      }
    } else {
      this.clearSelection();
    }
  }

  /**
   * Handle part hover
   * @param {Object} part - Product part object
   */
  handleHover(part) {
    // Clear previous hover
    this.clearHover();

    // Set new hover
    this.hoveredPart = part;

    // Store original material
    part.mesh.userData.originalMaterial = part.mesh.material;

    // Apply hover effect
    part.mesh.material = this.hoverMaterial.clone();

    // Add scale animation
    this.animateScale(part.mesh, 1.05, 200);

    // Add to highlighted meshes
    this.highlightedMeshes.add(part.mesh);

    // Update UI
    this.onPartSelect(part);
  }

  /**
   * Clear hover effects
   */
  clearHover() {
    if (this.hoveredPart && this.hoveredPart !== this.selectedPart) {
      const mesh = this.hoveredPart.mesh;

      // Restore original material
      if (mesh.userData.originalMaterial) {
        mesh.material = mesh.userData.originalMaterial;
      }

      // Reset scale
      this.animateScale(mesh, 1.0, 200);

      // Remove from highlighted meshes
      this.highlightedMeshes.delete(mesh);
    }

    this.hoveredPart = null;
  }

  /**
   * Handle part selection
   * @param {Object} part - Product part object
   */
  handleSelection(part) {
    // Clear previous selection
    this.clearSelection();

    // Set new selection
    this.selectedPart = part;

    // Store original material if not already stored
    if (!part.mesh.userData.originalMaterial) {
      part.mesh.userData.originalMaterial = part.mesh.material;
    }

    // Apply selection effect
    part.mesh.material = this.selectedMaterial.clone();

    // Add selection animations
    this.animateScale(part.mesh, 1.1, 300);
    this.animatePulse(part.mesh);

    // Add to highlighted meshes
    this.highlightedMeshes.add(part.mesh);

    // Update UI
    this.onPartSelect(part);
  }

  /**
   * Clear selection effects
   */
  clearSelection() {
    if (this.selectedPart) {
      const mesh = this.selectedPart.mesh;

      // Restore material only if not currently hovered
      if (
        this.hoveredPart !== this.selectedPart &&
        mesh.userData.originalMaterial
      ) {
        mesh.material = mesh.userData.originalMaterial;
      }

      // Reset scale
      this.animateScale(mesh, 1.0, 300);

      // Stop pulse animation
      this.stopPulse(mesh);

      // Remove from highlighted meshes if not hovered
      if (this.hoveredPart !== this.selectedPart) {
        this.highlightedMeshes.delete(mesh);
      }
    }

    this.selectedPart = null;
  }

  /**
   * Animate mesh scale
   * @param {THREE.Mesh} mesh - Target mesh
   * @param {number} targetScale - Target scale value
   * @param {number} duration - Animation duration in ms
   */
  animateScale(mesh, targetScale, duration) {
    const startScale = mesh.scale.x;
    const startTime = Date.now();

    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);

      const currentScale = startScale + (targetScale - startScale) * eased;
      mesh.scale.setScalar(currentScale);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    animate();
  }

  /**
   * Add pulsing animation to mesh
   * @param {THREE.Mesh} mesh - Target mesh
   */
  animatePulse(mesh) {
    mesh.userData.isPulsing = true;
    mesh.userData.pulseTime = 0;

    function pulse() {
      if (!mesh.userData.isPulsing) return;

      mesh.userData.pulseTime += 0.1;
      const pulseScale = 1.1 + Math.sin(mesh.userData.pulseTime) * 0.02;
      mesh.scale.setScalar(pulseScale);

      requestAnimationFrame(pulse);
    }

    pulse();
  }

  /**
   * Stop pulsing animation
   * @param {THREE.Mesh} mesh - Target mesh
   */
  stopPulse(mesh) {
    mesh.userData.isPulsing = false;
  }

  /**
   * Update interaction system (called in animation loop)
   */
  update() {
    // Update any ongoing animations
    const delta = this.clock.getDelta();

    // Update animation mixers if any
    this.animationMixers.forEach((mixer) => {
      mixer.update(delta);
    });

    // Update material animations for highlighted meshes
    this.updateMaterialAnimations();
  }

  /**
   * Update material animations for highlighted meshes
   */
  updateMaterialAnimations() {
    const time = Date.now() * 0.001;

    this.highlightedMeshes.forEach((mesh) => {
      if (mesh.material.emissive) {
        // Animate emissive intensity
        const intensity = 0.1 + Math.sin(time * 3) * 0.05;
        mesh.material.emissiveIntensity = intensity;
      }
    });
  }

  dispose() {
    // Clean up materials
    this.hoverMaterial.dispose();
    this.selectedMaterial.dispose();

    // Clear references
    this.highlightedMeshes.clear();
    this.animationMixers.length = 0;
  }
}
