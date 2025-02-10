// Set up the scene, camera, and renderer
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5); // Adjust camera position to view the model

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

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

    // Position and scale adjustments (if needed)
    model.position.set(-5, 0, 0); // Center the model
    model.scale.set(2.2, 2.2, 1);   // Adjust scale if the model is too large/small
    model.rotation.y = THREE.MathUtils.degToRad(25); // Rotate 25 degrees to the right

    // Check if there are animations
    if (gltf.animations && gltf.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(model);
      const action = mixer.clipAction(gltf.animations[0]); // Play the first animation
      action.play();

      // Animation loop
      const clock = new THREE.Clock();
      function animate() {
        const delta = clock.getDelta(); // Get time since last frame
        mixer.update(delta); // Update animations
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }
      animate();
    } else {
      // If no animations, render the model statically
      function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
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
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// updating balance dynamically 
const pnlCounter = document.getElementById('pnl-counter');

let net = 100000;

function updateBalance (newBalance) {
  const previousBalance = net;
  net = newBalance;
  pnlCounter.innerText = `$${net.toLocaleString()}`;

  // Update shadow and text colors dynamically
  if (net > previousBalance) {
    pnlCounter.style.color = 'green'; // Profit text color
    document.documentElement.style.setProperty('--color-secondary', 'rgba(0, 255, 0, 0.8)');
    document.documentElement.style.setProperty('--color-tertiary', 'rgba(0, 200, 0, 0.6)');
    document.documentElement.style.setProperty('--color-quaternary', 'rgba(0, 150, 0, 0.4)');
    document.documentElement.style.setProperty('--color-quinary', 'rgba(0, 100, 0, 0.2)');
  } else if (net < previousBalance) {
    pnlCounter.style.color = 'red'; // Loss text color
    document.documentElement.style.setProperty('--color-secondary', 'rgba(255, 0, 0, 0.8)');
    document.documentElement.style.setProperty('--color-tertiary', 'rgba(200, 0, 0, 0.6)');
    document.documentElement.style.setProperty('--color-quaternary', 'rgba(150, 0, 0, 0.4)');
    document.documentElement.style.setProperty('--color-quinary', 'rgba(100, 0, 0, 0.2)');
  }
}

setInterval(() => {
  const change = Math.floor(Math.random() * 2000 - 1000);
  updateBalance(net + change);
}, 2000);
