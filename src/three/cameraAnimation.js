import * as THREE from "three";
export class CameraAnimator {
  constructor(camera, controls) {
    this.camera = camera;
    this.controls = controls;
    this.isAutoRotating = true;
    this.rotationSpeed = 0.5;
    this.radius = 8;
    this.height = 3;
    this.angle = 0;

    this.initialPosition = this.camera.position.clone();
    this.initialTarget = new THREE.Vector3(0, 0, 0);

    this.clock = new THREE.Clock();
    this.time = 0;

    this.verticalMotion = {
      amplitude: 0.5,
      frequency: 0.3,
    };

    this.radialMotion = {
      amplitude: 1,
      frequency: 0.2,
    };
  }

  update() {
    if (!this.isAutoRotating) return;

    const delta = this.clock.getDelta();
    this.time += delta;

    this.angle += (this.rotationSpeed * delta * Math.PI) / 180;
    const dynamicRadius =
      this.radius +
      Math.sin(this.time * this.radialMotion.frequency) *
        this.radialMotion.amplitude;
    const dynamicHeight =
      this.height +
      Math.cos(this.time * this.verticalMotion.frequency) *
        this.verticalMotion.amplitude;
    const x = Math.cos(this.angle) * dynamicRadius;
    const z = Math.sin(this.angle) * dynamicRadius;
    const y = dynamicHeight;

    this.camera.position.set(x, y, z);

    this.camera.lookAt(0, 1, 0);
    if (this.controls) {
      this.controls.target.set(0, 1, 0);
      this.controls.update();
    }
  }

  pauseAutoRotation() {
    this.isAutoRotating = false;
  }

  resumeAutoRotation() {
    this.isAutoRotating = true;
    this.syncAngleWithPosition();
  }

  toggleAutoRotation() {
    if (this.isAutoRotating) {
      this.pauseAutoRotation();
    } else {
      this.resumeAutoRotation();
    }
  }
  reset() {
    this.angle = 0;
    this.time = 0;
    this.radius = 8;
    this.height = 3;
    this.animateToPosition(this.initialPosition, this.initialTarget, 1000);
  }

  syncAngleWithPosition() {
    const currentPos = this.camera.position;
    this.angle = Math.atan2(currentPos.z, currentPos.x);
    this.radius = Math.sqrt(
      currentPos.x * currentPos.x + currentPos.z * currentPos.z
    );
    this.height = currentPos.y;
  }

  /**
   * Animate camera to specific position
   * @param {THREE.Vector3} targetPosition - Target position
   * @param {THREE.Vector3} targetLookAt - Target look-at point
   * @param {number} duration - Animation duration in ms
   */
  animateToPosition(targetPosition, targetLookAt, duration = 1000) {
    const startPosition = this.camera.position.clone();
    const startLookAt = this.controls
      ? this.controls.target.clone()
      : new THREE.Vector3(0, 0, 0);
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      this.camera.position.lerpVectors(startPosition, targetPosition, eased);

      if (this.controls) {
        this.controls.target.lerpVectors(startLookAt, targetLookAt, eased);
        this.controls.update();
      } else {
        const currentLookAt = new THREE.Vector3().lerpVectors(
          startLookAt,
          targetLookAt,
          eased
        );
        this.camera.lookAt(currentLookAt);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.syncAngleWithPosition();
      }
    };

    animate();
  }

  /**
   * Set rotation speed
   * @param {number} speed - Rotation speed in degrees per second
   */
  setRotationSpeed(speed) {
    this.rotationSpeed = speed;
  }

  /**
   * Set camera orbit radius
   * @param {number} radius - Orbit radius
   */
  setOrbitRadius(radius) {
    this.radius = radius;
  }

  /**
   * Set camera orbit height
   * @param {number} height - Orbit height
   */
  setOrbitHeight(height) {
    this.height = height;
  }

  /**
   * Get current animation state
   * @returns {Object} Animation state object
   */
  getState() {
    return {
      isAutoRotating: this.isAutoRotating,
      rotationSpeed: this.rotationSpeed,
      radius: this.radius,
      height: this.height,
      angle: this.angle,
      time: this.time,
    };
  }

  /**
   * Set animation state
   * @param {Object} state - Animation state object
   */
  setState(state) {
    this.isAutoRotating = state.isAutoRotating || false;
    this.rotationSpeed = state.rotationSpeed || 0.5;
    this.radius = state.radius || 8;
    this.height = state.height || 3;
    this.angle = state.angle || 0;
    this.time = state.time || 0;
  }
}
