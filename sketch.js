// Edit Here - Start
const num = 15000; // Initial number of particles
const noiseScale = 0.01; // Noise scale for particle motion
let pointSize = 2; // Initial size of the points
// Edit Here - End


const particles = [];
let tempParticles = []; // Temporary particles array
let img; // Image to sample colors from


function preload() {
  img = loadImage('monalisa.jpg'); // Change image here
}
 
function setup() {
  createCanvas(windowWidth, windowHeight); // Fullscreen canvas
  img.resize(width, height); // Resize the image to match the canvas
  img.loadPixels(); // Load the pixel data of the image
 
  // Initialize particles randomly within the canvas
  for (let i = 0; i < num; i++) {
    particles.push(createVector(random(width), random(height)));
  }
 
  strokeWeight(pointSize); // Initial point size
}
 
function draw() {
  background(0, 10); // Add transparency for trails
 
  // Update and display permanent particles
  for (let i = 0; i < particles.length; i++) {
    updateParticle(particles[i]);
  }
 
  // Update and display temporary particles
  for (let i = tempParticles.length - 1; i >= 0; i--) {
    const tempParticle = tempParticles[i];
    if (millis() - tempParticle.spawnTime > 5000) {
      // Remove particle after 5 seconds
      tempParticles.splice(i, 1);
    } else {
      updateParticle(tempParticle.particle);
    }
  }
}
 
function updateParticle(p) {
  let n = noise(p.x * noiseScale, p.y * noiseScale); // Perlin noise value
  let angle = TAU * n; // Convert noise to angle
  p.x += cos(angle); // Update position based on angle
  p.y += sin(angle);
 
  // Wrap around if particles go off-screen
  if (!onScreen(p)) {
    p.x = random(width);
    p.y = random(height);
  }
 
  // Set particle color based on the image pixel underneath
  let col = getPixelColor(p.x, p.y);
  stroke(col);
  strokeWeight(pointSize); // Apply current point size
  point(p.x, p.y); // Draw particle
}
 
 
function getPixelColor(x, y) {
  // Get the color of the pixel from the image
  let ix = floor(x);
  let iy = floor(y);
  if (ix < 0 || iy < 0 || ix >= width || iy >= height) return color(0);
 
  let index = (iy * img.width + ix) * 4; // Pixel index
  let r = img.pixels[index];
  let g = img.pixels[index + 1];
  let b = img.pixels[index + 2];
  return color(r, g, b); // Return the color
}
 
function keyPressed() {
  if (key === 'p') {
    // Add 1,000 temporary particles
    for (let i = 0; i < 1000; i++) {
      const newParticle = createVector(random(width), random(height));
      tempParticles.push({ particle: newParticle, spawnTime: millis() });
    }
  }
}
 
function windowResized() {
  // Adjust canvas and image when the window is resized
  resizeCanvas(windowWidth, windowHeight);
  img.resize(width, height); // Resize image to fit the new canvas size
  img.loadPixels();
}
 
function mousePressed() {
  // Add new particles when right-clicking
  if (mouseButton === RIGHT) {
    for (let i = 0; i < 100; i++) {
      particles.push(createVector(random(width), random(height)));
    }
  } else {
    noiseSeed(millis()); // Reset noise field on left click
  }
}
 
function mouseWheel(event) {
  // Adjust point size using the mouse scroll wheel
  pointSize -= event.delta * 0.01; // Adjust sensitivity
  pointSize = constrain(pointSize, 0.5, 10); // Constrain size to a reasonable range
}
 
function onScreen(v) {
  return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}
