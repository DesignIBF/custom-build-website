// Categories Homepage Module JavaScript
// Add smooth scrolling for side-scroll containers
document.addEventListener("DOMContentLoaded", function () {
  const sideScrollContainers = document.querySelectorAll(".side-scroll");

  sideScrollContainers.forEach((container) => {
    // Add mouse wheel horizontal scrolling
    container.addEventListener("wheel", function (e) {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    });
  });
});
