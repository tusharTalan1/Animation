# Interactive Black Hole Simulation

An interactive, 2D physics-based simulation of a black hole built with vanilla HTML5 Canvas, CSS, and JavaScript. 

The simulation features a dynamic space-time grid, orbiting planets, gravitational destruction, and particle-based debris systems, all running smoothly in the browser.

## Features

### 🌌 Dynamic Space-Time Grid
The background features a grid that visually represents the bending of space-time. The grid lines dynamically calculate warp vectors based on the gravitational pull of both the central black hole and any massive planets passing through the area.

### 🪐 Planetary Orbital Mechanics
Clicking anywhere on the screen spawns a planet. Planets follow custom orbital physics:
- **Inverse Gravity:** Planets are constantly pulled towards the black hole based on their distance.
- **Orbital Momentum:** A tangential force is applied to create a natural "swirl", locking planets into stable orbits.
- **Orbital Decay:** Space friction gradually slows the planets down, causing their orbits to tighten and decay over time until they cross the event horizon.

### 💥 Event Horizon & Debris
When a planet gets too close to the black hole's event horizon, it is destroyed by intense gravitational forces. It shatters into glowing debris particles that get aggressively sucked into the core, eventually fading into nothingness.

### 🖱️ Interactive Controls
A sleek glassmorphism UI panel allows you to toggle the black hole's behavior:
- **Static Center:** The black hole is anchored to the exact center of the screen.
- **Dynamic Mouse:** The black hole actively hunts your cursor across the screen.

## Project Structure

The codebase is highly modular and relies entirely on vanilla web technologies with no external dependencies:

- **`index.html`**: Sets up the fullscreen canvas and the UI control panel.
- **`style.css`**: Handles the dark-space aesthetic and glassmorphism button styling.
- **`animation.js`**: The core physics and rendering engine.

### Code Architecture (`animation.js`)
The JavaScript logic is cleanly broken down into specific modular functions and object-oriented classes:

- **Classes**:
  - `Planet`: Handles the physics, gravity calculations, and gradient rendering of planets.
  - `Debris`: Manages the high-speed particle effects and lifecycle fading of destroyed planets.
  - `Star`: Controls the twinkling background starfield.
- **Physics Engine**:
  - `updateEntities()` manages the lifecycle and collision detection (event horizon crossings) for all objects.
  - `calculateWarp()` handles the complex mathematics for bending the space-time grid based on the mass of objects on the screen.
- **Rendering**:
  - `drawBlackHoleCore()` and `drawAccretionDisk()` manage the glowing gradients and composite rendering of the black hole itself.
  - `drawGrid()` leverages the warp calculations to draw the curved lines of the space-time fabric.
- **The Loop**:
  - The `animate()` function ties everything together in a lightweight, high-performance `requestAnimationFrame` loop.

## How to Run

Since the project uses vanilla web technologies, no build steps or local servers are required. 
Simply open `index.html` in any modern web browser to start the simulation!