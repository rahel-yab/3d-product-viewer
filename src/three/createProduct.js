import * as THREE from "three";

/**
 * Create a 3D chair product using basic geometries
 * @param {THREE.Scene} scene
 * @returns {Array}
 */
export function createProduct(scene) {
  const productParts = [];
  const chairGroup = new THREE.Group();
  chairGroup.name = "Chair";

  const materials = {
    seat: new THREE.MeshStandardMaterial({
      color: 0x800080,
      roughness: 0.3,
      metalness: 0.1,
      name: "seat_material",
    }),

    backrest: new THREE.MeshStandardMaterial({
      color: 0x800080,
      roughness: 0.3,
      metalness: 0.1,
      name: "backrest_material",
    }),

    legs: new THREE.MeshStandardMaterial({
      color: 0x800080,
      roughness: 0.2,
      metalness: 0.8,
      name: "legs_material",
    }),

    armrests: new THREE.MeshStandardMaterial({
      color: 0x800080,
      roughness: 0.3,
      metalness: 0.1,
      name: "armrests_material",
    }),
  };

  const seatGeometry = new THREE.BoxGeometry(2, 0.2, 2);
  const seatMesh = new THREE.Mesh(seatGeometry, materials.seat);
  seatMesh.position.set(0, 1, 0);
  seatMesh.castShadow = true;
  seatMesh.receiveShadow = true;
  seatMesh.name = "seat";
  chairGroup.add(seatMesh);

  productParts.push({
    name: "Seat",
    mesh: seatMesh,
    originalColor: new THREE.Color(0x8b4513),
    description:
      "Comfortable padded seat crafted from premium leather with ergonomic design for extended sitting.",
    category: "comfort",
  });

  // Create chair backrest
  const backGeometry = new THREE.BoxGeometry(2, 2, 0.2);
  const backMesh = new THREE.Mesh(backGeometry, materials.backrest);
  backMesh.position.set(0, 2, -0.9);
  backMesh.castShadow = true;
  backMesh.receiveShadow = true;
  backMesh.name = "backrest";
  chairGroup.add(backMesh);

  productParts.push({
    name: "Backrest",
    mesh: backMesh,
    originalColor: new THREE.Color(0x654321),
    description:
      "Ergonomically designed backrest providing optimal lumbar support and comfort for long periods.",
    category: "support",
  });

  // Create chair legs (4 legs)
  const legPositions = [
    { pos: [-0.8, 0.5, -0.8], name: "Back Left Leg" },
    { pos: [0.8, 0.5, -0.8], name: "Back Right Leg" },
    { pos: [-0.8, 0.5, 0.8], name: "Front Left Leg" },
    { pos: [0.8, 0.5, 0.8], name: "Front Right Leg" },
  ];

  legPositions.forEach((legInfo, index) => {
    const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1);
    const legMesh = new THREE.Mesh(legGeometry, materials.legs);
    legMesh.position.set(legInfo.pos[0], legInfo.pos[1], legInfo.pos[2]);
    legMesh.castShadow = true;
    legMesh.receiveShadow = true;
    legMesh.name = `leg_${index}`;
    chairGroup.add(legMesh);

    productParts.push({
      name: legInfo.name,
      mesh: legMesh,
      originalColor: new THREE.Color(0x2f2f2f),
      description:
        "Sturdy steel leg with brushed metal finish, providing excellent stability and durability.",
      category: "structure",
    });
  });

  // Create armrests
  const armrestPositions = [
    { pos: [-1.2, 1.5, 0], name: "Left Armrest" },
    { pos: [1.2, 1.5, 0], name: "Right Armrest" },
  ];

  armrestPositions.forEach((armInfo, index) => {
    // Armrest horizontal part
    const armGeometry = new THREE.BoxGeometry(0.2, 0.1, 1.5);
    const armMesh = new THREE.Mesh(armGeometry, materials.armrests);
    armMesh.position.set(armInfo.pos[0], armInfo.pos[1], armInfo.pos[2]);
    armMesh.castShadow = true;
    armMesh.receiveShadow = true;
    armMesh.name = `armrest_${index}`;
    chairGroup.add(armMesh);

    // Armrest support post
    const supportGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.5);
    const supportMesh = new THREE.Mesh(supportGeometry, materials.legs);
    supportMesh.position.set(armInfo.pos[0], 1.25, armInfo.pos[2]);
    supportMesh.castShadow = true;
    supportMesh.receiveShadow = true;
    supportMesh.name = `armrest_support_${index}`;
    chairGroup.add(supportMesh);

    productParts.push({
      name: armInfo.name,
      mesh: armMesh,
      originalColor: new THREE.Color(0x654321),
      description:
        "Comfortable padded armrest designed to reduce arm fatigue during extended use.",
      category: "comfort",
    });

    productParts.push({
      name: `${armInfo.name} Support`,
      mesh: supportMesh,
      originalColor: new THREE.Color(0x2f2f2f),
      description:
        "Metal support post connecting the armrest to the chair frame with secure mounting.",
      category: "structure",
    });
  });

  // Add decorative elements
  const decorativeElements = createDecorativeElements();
  decorativeElements.forEach((element) => {
    chairGroup.add(element.mesh);
    productParts.push(element);
  });

  // Position the entire chair group at origin
  chairGroup.position.set(0, 0, 0);
  scene.add(chairGroup);

  // Add subtle floating animation to the entire chair
  let time = 0;
  const originalY = chairGroup.position.y;

  function animateChair() {
    time += 0.01;
    chairGroup.position.y = originalY + Math.sin(time) * 0.02;
    chairGroup.rotation.y += 0.002;
    requestAnimationFrame(animateChair);
  }
  animateChair();

  return productParts;
}

/**
 * Create decorative elements for the chair
 * @returns {Array} Array of decorative elements
 */
function createDecorativeElements() {
  const elements = [];

  // Add decorative buttons/studs on the backrest
  const buttonMaterial = new THREE.MeshStandardMaterial({
    color: 0x444444,
    roughness: 0.1,
    metalness: 0.9,
  });

  const buttonPositions = [
    [-0.3, 2.2, -0.8],
    [0.3, 2.2, -0.8],
    [-0.3, 1.8, -0.8],
    [0.3, 1.8, -0.8],
  ];

  buttonPositions.forEach((pos, index) => {
    const buttonGeometry = new THREE.SphereGeometry(0.03, 8, 8);
    const buttonMesh = new THREE.Mesh(buttonGeometry, buttonMaterial);
    buttonMesh.position.set(pos[0], pos[1], pos[2]);
    buttonMesh.castShadow = true;
    buttonMesh.name = `decorative_button_${index}`;

    elements.push({
      name: `Decorative Button ${index + 1}`,
      mesh: buttonMesh,
      originalColor: new THREE.Color(0x444444),
      description:
        "Decorative metal stud adding visual detail and premium finish to the chair design.",
      category: "aesthetic",
    });
  });

  return elements;
}
