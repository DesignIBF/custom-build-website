document.addEventListener("DOMContentLoaded", function () {
  // Scroll to the saved position
  const scrollPosition = localStorage.getItem("scrollPosition");
  if (scrollPosition) {
    window.scrollTo(0, parseInt(scrollPosition, 10));
  }

  // Save the scroll position before leaving the page
  window.addEventListener("beforeunload", function () {
    localStorage.setItem("scrollPosition", window.scrollY);
  });
});
