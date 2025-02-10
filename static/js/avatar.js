// Get the model container
const modelContainer = document.getElementById('model-container');

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75, 
  modelContainer.offsetWidth / modelContainer.offsetHeight, 
  0.1, 
  1000
);
camera.position.set(0, 1.5, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(modelContainer.offsetWidth, modelContainer.offsetHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0); // Transparent background
modelContainer.appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Load the glTF model
const loader = new THREE.GLTFLoader();
loader.load(
  '/static/models/unc/uncglb.glb', // Path to your .gltf file
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);

    // Position and scale adjustments
    model.position.set(0, -1, .5);
    model.scale.set(3, 3, 1);

    // Check if there are animations
    if (gltf.animations && gltf.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(model);
      const action = mixer.clipAction(gltf.animations[0]);
      action.play();

      // Animation loop
      const clock = new THREE.Clock();
      function animate() {
        const delta = clock.getDelta();
        mixer.update(delta);
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }
      animate();
    } else {
      // Static rendering loop
      function animate() {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }
      animate();
    }
  },
  undefined,
  function (error) {
    console.error('Error loading glTF model:', error);
  }
);

// Handle resizing
window.addEventListener('resize', () => {
  const { offsetWidth, offsetHeight } = modelContainer;
  camera.aspect = offsetWidth / offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(offsetWidth, offsetHeight);
});

// Updating balance dynamically
const pnlCounter = document.getElementById('pnl-counter');

let net = 100000;

function updateBalance(newBalance) {
  const previousBalance = net;
  net = newBalance;

  // Update the counter text
  if (pnlCounter) {
    pnlCounter.innerText = `$${net.toLocaleString()}`;
  }

  // Update shadow and text colors dynamically
  if (net > previousBalance) {
    pnlCounter.style.color = 'green';
    document.documentElement.style.setProperty('--color-secondary', 'rgba(0, 255, 0, 0.8)');
    document.documentElement.style.setProperty('--color-tertiary', 'rgba(0, 200, 0, 0.6)');
    document.documentElement.style.setProperty('--color-quaternary', 'rgba(0, 150, 0, 0.4)');
    document.documentElement.style.setProperty('--color-quinary', 'rgba(0, 100, 0, 0.2)');
  } else if (net < previousBalance) {
    pnlCounter.style.color = 'red';
    document.documentElement.style.setProperty('--color-secondary', 'rgba(255, 0, 0, 0.8)');
    document.documentElement.style.setProperty('--color-tertiary', 'rgba(200, 0, 0, 0.6)');
    document.documentElement.style.setProperty('--color-quaternary', 'rgba(150, 0, 0, 0.4)');
    document.documentElement.style.setProperty('--color-quinary', 'rgba(100, 0, 0, 0.2)');
  }
}

// Simulate balance changes
setInterval(() => {
  const change = Math.floor(Math.random() * 2000 - 1000);
  updateBalance(net + change);
}, 2000);