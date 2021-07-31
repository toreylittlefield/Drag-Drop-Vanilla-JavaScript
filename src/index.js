import iconsArray from "./Icons";
const gridItems = document.querySelectorAll(".grid-item");

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
  const x = event.pageX;
  const y = event.pageY;

  //top + pageYOffset +
  const checkYPositions =
    y <= pageYOffset + top || y >= height + pageYOffset + top;
  const checkXPosition = x <= left || x >= width + left;
  if (checkXPosition && checkYPositions) {
    console.log("edge case");
    return "all";
  }
  // hit top-bottom boundary
  if (checkYPositions) return "left-right";
  // hit left-right boundary
  if (checkXPosition) return "top-bottom";

  const currentClosetElement = document.elementFromPoint(x, y);
  if (!currentClosetElement) return "all";
  if (
    !currentClosetElement.className.startsWith("grid-item") ||
    currentClosetElement.id === "active-clone"
  )
    return "all";
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
  const { width, height } = element.getBoundingClientRect().toJSON();

  const canMove = isOverElement(event, element);
  if (canMove === "all") {
    element.style.top = event.pageY - height / 3 + "px";
    element.style.left = event.pageX - width / 3 + "px";
  }
  if (canMove === "top-bottom") {
    element.style.top = event.pageY - height / 3 + "px";
  }
  if (canMove === "left-right") {
    element.style.left = event.pageX - width / 3 + "px";
  }
};

/**
 * @description clones once the currently selected element
 * @param {HTMLElement} element
 * @returns
 */
const addRemoveClonedNode = (element) => {
  if (element.classList.contains("dragging-active-item-move")) return;

  const nextSibling = element.nextElementSibling;
  const clonedElement = element.cloneNode();
  clonedElement.id = "active-clone";
  element.classList.add("dragging-active-item-move");
  if (nextSibling) nextSibling.before(clonedElement);
  if (!nextSibling) element.parentElement.append(clonedElement);
  [...gridItems].forEach((item) => {
    if (
      item.id === "active-clone"
      // ||
      // item.classList.contains("dragging-active-item-move")
    )
      return;
    item.style.transform = `scale(1)`;
    item.classList.remove("pulse");
  });
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
  element.classList.remove("dragging-active-item-move");
  element.classList.remove("dragging-active-item-down");
  element.releasePointerCapture(event.pointerId);
};

/**
 * @description selecting an element on pointer down
 * @param {PointerEvent} event
 */
function down(event) {
  event.preventDefault();
  let element;
  if (event.target.parentElement.className === "grid-container") {
    element = event.target;
  } else {
    element = event.target.parentElement;
  }
  element.classList.add("dragging-active-item-down");
  element.setPointerCapture(event.pointerId);

  // from css variable
  const pressDuration = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--animation-duration"
    )
  );
  const longPress = setTimeout(() => {
    console.log("inside");
    element.removeEventListener("pointerup", clearTimer);
    [...gridItems].forEach((item) => {
      item.style.transform = `scale(0.95)`;
      item.classList.add("pulse");
    });
    // add our listener events to move and drag
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", (event) => up(event, element), {
      once: true
    });
  }, pressDuration);

  // clear the timer if pointerup event occurs and cancel / remove
  const clearTimer = () => {
    clearTimeout(longPress);
    [...gridItems].forEach((item) => {
      item.style.transform = `scale(1)`;
      item.classList.remove("pulse");
    });
    element.classList.remove("dragging-active-item-down");
    element.releasePointerCapture(event.pointerId);
  };
  element.addEventListener("pointerup", clearTimer, { once: true });
}

// generate random background colors and fonts
const generateRandomRGBA = () => {
  let [h, s, l] = Array(3)
    .fill(0)
    .map((color, idx) =>
      idx === 0
        ? 0 + Math.ceil(Math.random() * 50)
        : 70 + Math.ceil(Math.random() * 30)
    );
  let fontColor = `hsla(${0},${s >= 60 ? 50 : 10}%,${l >= 60 ? 10 : 100}%,1)`;
  return { rgbaBG: `hsla(${h},${s}%,${l}%,0.8)`, rgbaFontColor: fontColor };
};

// label and add styles to grid-items at runtime
gridItems.forEach((gridItem, index) => {
  const { rgbaBG, rgbaFontColor } = generateRandomRGBA();
  const icon = document.createElement("img");
  gridItem.textContent = "";
  icon.src = iconsArray[index];
  icon.height = gridItem.clientWidth / 2;
  icon.width = gridItem.clientHeight / 2;
  icon.id = `icon-${index}`;
  gridItem.appendChild(icon);
  gridItem.id = index;
  gridItem.style.backgroundColor = rgbaBG;
  gridItem.style.color = rgbaFontColor;
  gridItem.onpointerdown = down;
});
