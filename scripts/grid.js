const moduleContainer = document.getElementById("module-container");

// Create and append the grid overlay to the body
const gridOverlay = document.createElement("div");
gridOverlay.className = "grid-overlay";

// Create the grid columns dynamically
const columns = 12; // Adjust the number of columns here
for (let i = 0; i < columns; i++) {
  const column = document.createElement("div");
  column.className = "grid-column";
  gridOverlay.appendChild(column);
}

// Append the overlay to the body
document.body.appendChild(gridOverlay);

// Toggle the grid overlay on and off
function toggleGridOverlay() {
  gridOverlay.classList.toggle("active");
}

// Listen for a keypress to toggle the overlay (e.g., 'G' key)
document.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "g") {
    toggleGridOverlay();
  }
});
