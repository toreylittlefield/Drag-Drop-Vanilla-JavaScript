const gridItems = document.querySelectorAll(".grid-item");

/**
 * @type {DOMRect}
 */
let top, bottom, left, right, height;
window.addEventListener("DOMContentLoaded", () => {
  writeToScreenBox("DOM Loaded");
  setTimeout(() => {
    let {
      top: t,
      bottom: b,
      left: l,
      right: r,
      height: h
    } = document
      .querySelector(".grid-container")
      .getBoundingClientRect()
      .toJSON();
    top = t;
    bottom = b;
    left = l;
    right = r;
    height = h;
  }, 2000);
});

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
};

writeToScreenBox({ top, bottom, left, right, height });

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
  // console.log({ moveEvent: event });
  const x = event.x;
  const y = event.y;
  // hit left-right boundary
  if (x <= left || x >= right) return "top-bottom";
  // hit top-bottom boundary
  if (y <= top || y >= bottom) return "left-right";

  const currentClosetElement = document.elementFromPoint(x, y);
  if (
    currentClosetElement.className !== "grid-item" ||
    currentClosetElement.id === "active-clone"
  )
    return "all";
  const clondedNode = document.querySelector("#active-clone");
  const clonedCopy = clondedNode.cloneNode();
  currentClosetElement.replaceWith(clonedCopy);
  clondedNode.replaceWith(currentClosetElement);
  // console.log({ currentClosetElement, clondedNode, clonedCopy });
  return "all";
  // // moving to left
  // if (event.movementX < 0) return currentClosetElement.before(clondedNode);
  // // moving to right
  // if (event.movementX > 0) return currentClosetElement.after(clondedNode);
  // // moving down
  // if (event.movementY < 0) return currentClosetElement.after(clondedNode);
  // // moving up
};

/**
 * @description dragging the selected element
 * @param {PointerEvent} event
 */
const move = (event) => {
  const element = event.target;
  addRemoveClonedNode(element, false);
  element.style.position = "absolute";
  const canMove = isOverElement(event, element);
  if (canMove === "all") {
    element.style.top = event.pageY + "px";
    element.style.left = event.pageX + "px";
  }
  if (canMove === "top-bottom") element.style.top = event.pageY + "px";
  if (canMove === "left-right") element.style.left = event.pageX + "px";
};

/**
 * @description releasing the pointer i.e. mouse or touch
 * @param {PointerEvent} event
 * @param {HTMLElement} element
 */
const up = (event, element) => {
  const clonedElement = document.querySelector("#active-clone");
  // console.log({ element, clonedElement });
  if (clonedElement) {
    clonedElement.replaceWith(element);
    clonedElement.remove();
    clonedElement.removeEventListener("pointerup", up);
  }
  element.removeEventListener("pointermove", move);
  // element.style.position = "static";
  // element.style.top = "none"
  // element.style.left = "none";
  // element.style.transform = "none";
  // element.style.pointerEvents = "auto";

  element.style.position = "";
  element.style.top = "";
  element.style.left = "";
  element.style.transform = "";
  element.style.pointerEvents = "auto";

  // addRemoveClonedNode(null, true);
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
  // console.log({ clonedElement });
  if (nextSibling) nextSibling.before(clonedElement);
  if (!nextSibling) element.parentElement.append(clonedElement);
};

/**
 * @description selecting an element on pointer down
 * @param {PointerEvent} event
 */
function down(event) {
  // writeToScreenBox(event);
  // writeToScreenBox(event.target);

  top = document.documentElement.scrollTop + top;
  bottom = height + top;
  writeToScreenBox({ top, bottom, left, right, height });

  const element = event.target;
  element.style.pointerEvents = "none";
  element.setPointerCapture(event.pointerId);
  element.style.transform = `scale(1.25)`;
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
