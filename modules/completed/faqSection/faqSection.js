// FAQ Section JavaScript
// FAQ accordion functionality
document.addEventListener("DOMContentLoaded", function () {
  // Wait for content to be loaded
  setTimeout(() => {
    initializeFaqAccordion();
  }, 2000);
});

function initializeFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(
      ".container.flex-row.between.a-i-center"
    );

    if (question) {
      question.addEventListener("click", () => {
        // Close other open items
        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove("active");
          }
        });

        // Toggle current item
        item.classList.toggle("active");
      });
    }
  });
}
