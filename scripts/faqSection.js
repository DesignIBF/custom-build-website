// var faq = document.getElementById("faq");
// var faqItem = document.querySelector(".faq-item");
// var answer = document.getElementById("answer");

// faq.addEventListener("click", test);

// function test() {
//   console.log("yes");
//   answer.classList.toggle("open");
//   faqItem.classList.toggle("open");
// }

// console.log("FAQ");

///////////////////////////////////////////////

// console.log("FAQ Script Loaded");

// // Wait until all FAQ components are loaded
// document.addEventListener("DOMContentLoaded", function () {
//   function initializeFAQ() {
//     var faqItems = document.querySelectorAll(".faq-item");

//     if (faqItems.length === 0) {
//       console.warn("No FAQ items found yet, retrying...");
//       setTimeout(initializeFAQ, 200); // Retry until loaded
//       return;
//     }

//     console.log(`Found ${faqItems.length} FAQ items`);

//     faqItems.forEach(function (faqItem) {
//       var answer = faqItem.querySelector(".answer");
//       var svgIcon = faqItem.querySelector("svg");

//       if (!answer) {
//         console.warn("No answer found inside:", faqItem);
//         return;
//       }

//       faqItem.addEventListener("click", function () {
//         console.log("FAQ item clicked!");

//         // Toggle open state only for this specific item
//         faqItem.classList.toggle("open");

//         if (faqItem.classList.contains("open")) {
//           answer.style.maxHeight = answer.scrollHeight + "px";
//         } else {
//           answer.style.maxHeight = "0px";
//         }

//         // Rotate the SVG icon
//         svgIcon.style.transform = faqItem.classList.contains("open")
//           ? "rotate(0deg)"
//           : "rotate(-180deg)";
//       });
//     });
//   }

//   initializeFAQ();
// });

//////////////////////////

console.log("FAQ Script Loaded");

// Define FAQ content in an array
const faqData = [
  {
    question: "1. Buying in bulk",
    answer:
      "You can select the product and length you wish and order by the box lots only.",
    linkText: "This link here is optional",
    linkHref: "#",
  },
  {
    question: "2. Customize your own box",
    answer:
      "Buy by the bunch at farm level and customize your own box. Start a custom box at a grower and fill up that box with more items from that same grower. After your custom box is filled or closed, you can start  buying from all the 3 options again.",
    linkText: "This link here is optional",
    linkHref: "#",
  },
  {
    question: "3. Shop by a shopping list",
    answer:
      "Use the shopping list technology and let the system buy at the most efficient way. Just add the products, minimum stem length, and quantities you need and let the shopping list technology search through all growers and packing options what will be your best and most affordable way to pack and ship all your flowers. This option works in general for larger quantities.",
    linkText: "",
    linkHref: "#",
  },
  {
    question: "4. By standing order",
    answer:
      "Set a weekly, bi-weekly, or monthly Standing Order and receive a more competitive price. For a weekly year-round Standing Order, you receive double quantities during Valentine's and Mothers Day for the same buying price.",
    linkText: "",
    linkHref: "#",
  },
  {
    question: "5. Re-order your previous boxes",
    answer:
      "Use the re-order button on your order history page to re-order the same box again for one or more dates.",
    linkText: "",
    linkHref: "#",
  },
];

// Wait until all FAQ components are loaded
document.addEventListener("DOMContentLoaded", function () {
  function initializeFAQ() {
    var faqItems = document.querySelectorAll(".faq-item");

    if (faqItems.length === 0) {
      console.warn("No FAQ items found yet, retrying...");
      setTimeout(initializeFAQ, 200); // Retry until loaded
      return;
    }

    console.log(`Found ${faqItems.length} FAQ items`);

    faqItems.forEach((faqItem, index) => {
      if (!faqData[index]) return; // Skip if no matching data entry

      var question = faqItem.querySelector("h3");
      var answer = faqItem.querySelector(".answer p");
      var link = faqItem.querySelector(".answer a");

      // Insert dynamic content
      question.textContent = faqData[index].question;
      answer.textContent = faqData[index].answer;
      link.textContent = faqData[index].linkText;
      link.href = faqData[index].linkHref;

      // Add click event for toggling
      faqItem.addEventListener("click", function () {
        console.log("FAQ item clicked!");

        var answerContainer = faqItem.querySelector(".answer");
        var svgIcon = faqItem.querySelector("svg");

        // Toggle open state
        faqItem.classList.toggle("open");

        if (faqItem.classList.contains("open")) {
          answerContainer.style.maxHeight = answerContainer.scrollHeight + "px";
        } else {
          answerContainer.style.maxHeight = "0px";
        }

        // Rotate SVG icon
        svgIcon.style.transform = faqItem.classList.contains("open")
          ? "rotate(-180deg)"
          : "rotate(0deg)";
      });
    });
  }

  initializeFAQ();
});
