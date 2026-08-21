const items = document.querySelectorAll(".accordion-item");
const links = document.querySelectorAll(".sidebar a");

const cleanLabel = (text) =>
  text
    .replace(/^\s*\d+\.\d+\.[a-z]\s+/i, "")
    .replace(/^\s*\d+\.\d+\s+/, "")
    .trim();

const removeNumbering = () => {
  document.querySelectorAll(".chapter-title").forEach((el) => {
    el.textContent = cleanLabel(el.textContent || "");
  });

  links.forEach((el) => {
    el.textContent = cleanLabel(el.textContent || "");
  });

  document.querySelectorAll(".accordion-content li").forEach((li) => {
    li.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";
        if (text.trim()) {
          node.textContent = cleanLabel(text);
        }
      }
    });
  });
};

removeNumbering();

const getLiIndex = (li) =>
  Array.from(li.parentElement.children)
    .filter((child) => child.tagName === "LI")
    .indexOf(li) + 1;

const getResourcePath = (li) => {
  const chapterItem = li.closest(".accordion-item");
  const chapterIndex = Array.from(items).indexOf(chapterItem) + 1;
  const topLevelParentLi = li.parentElement.closest("li");

  if (topLevelParentLi) {
    const topicIndex = getLiIndex(topLevelParentLi);
    const subtopicIndex = getLiIndex(li);
    return `resources/chapter-${chapterIndex}/topic-${topicIndex}/subtopic-${subtopicIndex}/index.html`;
  }

  const topicIndex = getLiIndex(li);
  return `resources/chapter-${chapterIndex}/topic-${topicIndex}/index.html`;
};

const addResourceLinks = () => {
  const topicItems = document.querySelectorAll(".accordion-content li");

  topicItems.forEach((li) => {
    const firstElement = li.firstElementChild;
    if (firstElement && firstElement.classList.contains("topic-row")) {
      return;
    }

    const nestedList = Array.from(li.children).find((child) => child.tagName === "UL");
    const row = document.createElement("div");
    row.className = "topic-row";

    const textWrap = document.createElement("span");
    textWrap.className = "topic-text";

    const resourceChip = document.createElement("a");
    resourceChip.className = "resource-chip";
    resourceChip.textContent = "Resource";
    resourceChip.href = getResourcePath(li);
    resourceChip.setAttribute("aria-label", "Open resource page");
    resourceChip.title = "Open resource page";

    const nodesToMove = [];
    li.childNodes.forEach((node) => {
      if (nestedList && node === nestedList) {
        return;
      }
      nodesToMove.push(node);
    });

    nodesToMove.forEach((node) => textWrap.appendChild(node));
    row.appendChild(textWrap);
    row.appendChild(document.createTextNode("  "));
    row.appendChild(resourceChip);

    if (nestedList) {
      li.insertBefore(row, nestedList);
    } else {
      li.appendChild(row);
    }
  });
};

addResourceLinks();

items.forEach((item) => {
  const button = item.querySelector(".accordion-header");
  const content = item.querySelector(".accordion-content");

  button.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    items.forEach((otherItem) => {
      otherItem.classList.remove("open");
      const otherButton = otherItem.querySelector(".accordion-header");
      const otherContent = otherItem.querySelector(".accordion-content");
      otherButton.setAttribute("aria-expanded", "false");
      otherContent.style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add("open");
      button.setAttribute("aria-expanded", "true");
      content.style.maxHeight = `${content.scrollHeight}px`;
    }
  });
});

links.forEach((link) => {
  link.addEventListener("click", () => {
    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);
    const button = target.querySelector(".accordion-header");

    items.forEach((item) => {
      item.classList.remove("open");
      const otherButton = item.querySelector(".accordion-header");
      const otherContent = item.querySelector(".accordion-content");
      otherButton.setAttribute("aria-expanded", "false");
      otherContent.style.maxHeight = null;
    });

    target.classList.add("open");
    button.setAttribute("aria-expanded", "true");
    const content = target.querySelector(".accordion-content");
    content.style.maxHeight = `${content.scrollHeight}px`;
  });
});
