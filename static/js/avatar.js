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
  '/static/models/uncglb.glb', // Path to your .gltf file
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);

    // Position and scale adjustments (if needed)
    model.position.set(-5, 0, 0); // Center the model
    model.scale.set(2, 2, 1.5);   // Adjust scale if the model is too large/small
    model.rotation.y = THREE.MathUtils.degToRad(25); // Rotate 45 degrees to the right
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