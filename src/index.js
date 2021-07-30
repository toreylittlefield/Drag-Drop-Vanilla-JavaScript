const gridItems = document.querySelectorAll(".grid-item");

/**
 * @type {DOMRect}
 */
// let top, bottom, left, right, height;
// window.addEventListener("DOMContentLoaded", () => {
//   writeToScreenBox("DOM Loaded");
//   setTimeout(() => {
//     let {
//       top: t,
//       bottom: b,
//       left: l,
//       right: r,
//       height: h
//     } = document
//       .querySelector(".grid-container")
//       .getBoundingClientRect()
//       .toJSON();
//     top = t;
//     bottom = b;
//     left = l;
//     right = r;
//     height = h;
//   }, 2000);
// });

// writes text in <p> tags and appends to the logging-box list
const writeToScreenBox = (logOutput) => {
  const loggingBoxList = document.querySelector(".logging-box ul");
  const li = document.createElement("li");
  const pTag = document.createElement("p");
  let output = logOutput;

  if (typeof output === "object")
    pTag.innerText = JSON.stringify(logOutput, null, 2);
  if (typeof output === "string") pTag.innerText = logOutput;
  if (typeof output !== "string" && typeof output !== "object")
    pTag.innerText = logOutput;

  li.appendChild(pTag);
  loggingBoxList.append(li);
  // remove nodes if length is
  const MAX_NUMBER_TO_DISPLAY = 10;
  let COUNT_ELEMENTS = () => loggingBoxList.childElementCount;
  while (MAX_NUMBER_TO_DISPLAY < COUNT_ELEMENTS()) {
    loggingBoxList.firstElementChild.remove();
  }
};

// writeToScreenBox({ top, bottom, left, right, height });

/**
 * @param {Event} event
 * @param {NodeList} gridItems
 */
const randomShuffle = () => {
  const numOfItems = gridItems.length;
  const randomGridId = () => Math.ceil(Math.random() * numOfItems - 1);
  [...gridItems].forEach((currentItem) => {
    const randomGridItem = document.getElementById(randomGridId());
    randomGridItem.after(currentItem);
  });
};

const shuffleButtonSelector = document.querySelector(".btn.shuffle");
shuffleButtonSelector.onclick = randomShuffle;

/**
 * @description swaps in the DOM the cloned element with the grid-item that the pointer is currently over
 * @param {PointerEvent} event
 * @param {HTMLElement} element
 */
const isOverElement = (event = PointerEvent, element = HTMLElement) => {
  let { width, height, left, top } = document
    .querySelector(".grid-container")
    .getBoundingClientRect()
    .toJSON();
  const x = event.x;
  const y = event.y;
  const checkYPositions = y <= pageYOffset + top || y >= height - pageYOffset;
  const checkXPosition = x <= left + pageXOffset || x >= width - pageXOffset;
  // hit top-bottom boundary
  if (checkYPositions) return "left-right";
  // hit left-right boundary
  if (checkXPosition) return "top-bottom";

  const currentClosetElement = document.elementFromPoint(x, y);
  if (currentClosetElement) {
  }
  if (
    !currentClosetElement.className.startsWith("grid-item") ||
    currentClosetElement.id === "active-clone"
  )
    return "all";
  writeToScreenBox(
    currentClosetElement.className || currentClosetElement.tagName
  );
  const clondedNode = document.querySelector("#active-clone");
  const clonedCopy = clondedNode.cloneNode();
  currentClosetElement.replaceWith(clonedCopy);
  clondedNode.replaceWith(currentClosetElement);
  return "all";
};

/**
 * @description dragging the selected element
 * @param {PointerEvent} event
 */
const move = (event) => {
  const element = event.target;
  addRemoveClonedNode(element, false);
  element.style.position = "absolute";
  element.style.zIndex = 1;

  const { width, height } = element.getBoundingClientRect().toJSON();
  const canMove = isOverElement(event, element);
  if (canMove === "all") {
    element.style.top = event.pageY - height / 3 + "px";
    element.style.left = event.pageX - width / 3 + "px";
  }
  if (canMove === "top-bottom")
    element.style.top = event.pageY - height / 3 + "px";
  if (canMove === "left-right")
    element.style.left = event.pageX - width / 3 + "px";
};

/**
 * @description releasing the pointer i.e. mouse or touch
 * @param {PointerEvent} event
 * @param {HTMLElement} element
 */
const up = (event, element) => {
  const clonedElement = document.querySelector("#active-clone");
  if (clonedElement) {
    clonedElement.replaceWith(element);
    clonedElement.remove();
    // clonedElement.removeEventListener("pointerup", up);
  }
  [...gridItems].forEach((item) => {
    item.style.transform = `scale(1)`;
    item.classList.remove("pulse");
  });
  element.removeEventListener("pointermove", move);
  element.style.cursor = "grab";
  element.style.position = "";
  element.style.top = "";
  element.style.left = "";
  element.style.transform = "";
  element.style.pointerEvents = "auto";
  element.style.zIndex = 0;
  element.releasePointerCapture(event.pointerId);
};

/**
 * @description clones once the currently selected element
 * @param {HTMLElement} element
 * @param {Boolean} removed
 * @returns
 */
const addRemoveClonedNode = (element, removed) => {
  if (removed) {
    const clonedActive = document.getElementById("active-clone");
    if (clonedActive) clonedActive.remove();
    return;
  }

  if (element?.style.position === "absolute") return;

  const nextSibling = element.nextElementSibling;
  const clonedElement = element.cloneNode();
  clonedElement.id = "active-clone";
  clonedElement.style.transform = `scale(1.25)`;
  if (nextSibling) nextSibling.before(clonedElement);
  if (!nextSibling) element.parentElement.append(clonedElement);
};

/**
 * @description selecting an element on pointer down
 * @param {PointerEvent} event
 */
function down(event) {
  event.preventDefault();
  [...gridItems].forEach((item) => {
    item.style.transform = `scale(0.95)`;
    item.classList.add("pulse");
  });
  const element = event.target;
  element.style.cursor = "grabbing";
  element.style.pointerEvents = "none";
  element.setPointerCapture(event.pointerId);
  element.style.transform = `rotate(-5deg) scale(1.25)`;

  // add our listener events
  element.addEventListener("pointermove", move);
  element.addEventListener("pointerup", (event) => up(event, element), {
    once: true
  });
}

// generate random background colors and fonts
const generateRandomRGBA = () => {
  let [h, s, l] = Array(3)
    .fill(0)
    .map((color, idx) =>
      idx === 0
        ? Math.ceil(Math.random() * 365)
        : Math.ceil(Math.random() * 100)
    );
  let fontColor = `hsla(${0},${s >= 60 ? 50 : 10}%,${l >= 60 ? 10 : 100}%,1)`;
  return { rgbaBG: `hsla(${h},${s}%,${l}%,0.8)`, rgbaFontColor: fontColor };
};

// label and add styles to grid-items at runtime
gridItems.forEach((gridItem, index) => {
  const { rgbaBG, rgbaFontColor } = generateRandomRGBA();
  gridItem.id = index;
  gridItem.style.backgroundColor = rgbaBG;
  gridItem.style.color = rgbaFontColor;

  gridItem.onpointerdown = down;
});

// hide show the console on button click event
class buttonState {
  constructor() {
    this.open = false;
  }

  /**
   * @param {boolean} open
   */
  set toggle(open) {
    open === false ? (this.open = true) : (this.open = false);
  }

  toggleOpen() {
    return this.open;
  }
}
const buttonOpen = new buttonState();
const loggingSection = document.querySelector(".logging-box-section");
const buttonSelector = document.querySelector(".btn.show");
const listSection = document.querySelector(".logging-box ul");

buttonSelector.addEventListener("click", (event) => {
  buttonOpen.open = !buttonOpen.open;
  if (buttonOpen.toggleOpen()) {
    loggingSection.style.height = "min(70vh, 100%)";
    listSection.style.visibility = "visible";
  }
  if (!buttonOpen.toggleOpen()) {
    loggingSection.style.height = "50px";
    listSection.style.visibility = "hidden";
  }
  event.preventDefault();
});
