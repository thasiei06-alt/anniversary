const revealItems = document.querySelectorAll("[data-reveal]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const togetherCounter = document.querySelector(".together-counter");
const counterStart = new Date(togetherCounter.dataset.startDate);
const daysOutput = togetherCounter.querySelector("[data-counter-days]");
const clockOutput = togetherCounter.querySelector("[data-counter-clock]");

function updateTogetherCounter() {
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - counterStart.getTime()) / 1000));
  const days = Math.floor(elapsedSeconds / 86400);
  const hours = Math.floor((elapsedSeconds % 86400) / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;

  daysOutput.textContent = days.toLocaleString();
  clockOutput.textContent = [hours, minutes, seconds]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");
}

updateTogetherCounter();
window.setInterval(updateTogetherCounter, 1000);

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const noteButton = document.querySelector(".note-button");
const loveNote = document.querySelector("#love-note");

noteButton.addEventListener("click", () => {
  const isExpanded = noteButton.getAttribute("aria-expanded") === "true";
  noteButton.setAttribute("aria-expanded", String(!isExpanded));
  loveNote.hidden = isExpanded;
  noteButton.innerHTML = isExpanded
    ? 'Open your little note <span aria-hidden="true">♡</span>'
    : 'A little more love <span aria-hidden="true">↗</span>';
});

const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector(".lightbox-caption");
const lightboxClose = lightbox.querySelector(".lightbox-close");

document.querySelectorAll(".photo-tile").forEach((tile) => {
  tile.addEventListener("click", () => {
    const image = tile.querySelector("img");
    const caption = tile.querySelector(".photo-caption");

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = caption.textContent;
    lightbox.showModal();
  });
});

lightboxClose.addEventListener("click", () => lightbox.close());

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

lightbox.addEventListener("close", () => {
  lightboxImage.removeAttribute("src");
  lightboxImage.alt = "";
});
