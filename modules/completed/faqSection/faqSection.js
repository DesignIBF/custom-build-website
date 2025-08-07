// FAQ Section JavaScript
console.log("FAQ Section component loaded");

// Load FAQ content from JSON and initialize
async function loadFAQContent() {
  try {
    const response = await fetch("content/global/faqSection.json");
    const faqData = await response.json();

    // Populate header content
    document.getElementById("faq-subtitle").textContent = faqData.subtitle;
    document.getElementById("faq-title").textContent = faqData.title;
    document.getElementById("faq-description").textContent =
      faqData.description;

    // Populate button
    const button = document.getElementById("faq-button");
    button.textContent = faqData.button.text;
    button.href = faqData.button.href;

    // Generate FAQ items
    const container = document.getElementById("faq-items-container");

    // Create FAQ items
    faqData.faqs.forEach((faq, index) => {
      const faqItem = createFAQItem(faq, index);
      container.appendChild(faqItem);
    });

    // Initialize accordion functionality with a small delay
    setTimeout(() => {
      initializeFaqAccordion();
    }, 100);
  } catch (error) {
    console.error("Error loading FAQ content:", error);
  }
}

// Create individual FAQ item with simple structure
function createFAQItem(faqData, index) {
  const faqItem = document.createElement("div");
  faqItem.className = "container faq-item flex-column";
  faqItem.id = `faq-${index}`;

  faqItem.innerHTML = `
    <div class="container flex-row between a-i-center">
      <h3>${faqData.question}</h3>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="52"
        height="52"
        viewBox="0 0 52 52"
        fill="none"
      >
        <rect
          x="52"
          width="52"
          height="52"
          rx="26"
          transform="rotate(90 52 0)"
          fill="#F6F2F0"
        />
        <path
          d="M26 16.6629L26 35.3296L34 27.3296M26 35.3374L18 27.3374"
          stroke="#0C331F"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <div class="answer container flex-column gap-25">
      <p>${faqData.answer}</p>
      ${
        faqData.link && faqData.link.text
          ? `<a href="${faqData.link.href}" target="_blank">${faqData.link.text}</a>`
          : ""
      }
    </div>
  `;

  return faqItem;
}

// FAQ accordion functionality
function initializeFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(
      ".container.flex-row.between.a-i-center"
    );

    if (question) {
      question.addEventListener("click", () => {
        item.classList.toggle("open");
      });
    }
  });
}

// Initialize when the component loads
loadFAQContent();
