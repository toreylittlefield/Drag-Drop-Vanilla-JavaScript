import { moveViewPortToCenter } from "./Utils";

const GRIDITEMS = document.querySelectorAll(".grid-item");
const showHideBtn = document.querySelector(".btn.change-view");
const gridContainer = document.querySelector(".grid-container");
const darkModeToggle = document.querySelector(".btn.dark-mode");
// from css variable
const PRESS_DURATION = Math.ceil(
  parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--animation-duration-flip"
    ),
    10
  )
);

// Scroll to middle of grid container
(() => {
  console.log("scrolled on load");
  // gridContainer.scrollIntoView({
  //   behavior: "smooth",
  //   block: "center",
  //   inline: "center"
  // });
  window.scrollTo(0, Math.ceil(window.innerWidth / 2));
})();

/**
 * @description add pointerdown event listeners
 */
[...GRIDITEMS].forEach((gridItem) => (gridItem.onpointerdown = down));

/**
 * @description add opacity to grid-container::after
 */
const gridAfterSelector = [...document.styleSheets[0].cssRules].find(
  (rule) => rule.selectorText === ".grid-container::after"
);

/**
 * @description swaps in the DOM the cloned element with the grid-item that the pointer is currently over
 * @param {PointerEvent} event
 * @param {HTMLElement} element
 */
const isOverElement = (
  event = PointerEvent,
  element = HTMLElement,
  width = 0,
  height = 0
) => {
  // let { width, height, left, top } = document
  //   .querySelector(".grid-container")
  //   .getBoundingClientRect()
  //   .toJSON();
  const x = event.clientX - height / 2;
  const y = event.clientY - width / 2;

  //top + pageYOffset +
  // const checkYPositions =
  //   y <= pageYOffset + top || y >= height + pageYOffset + top;
  // const checkXPosition = x <= left || x >= width + left;
  // if (checkXPosition && checkYPositions) {
  //   // console.log("edge case");
  //   return "all";
  // }
  // // hit top-bottom boundary
  // if (checkYPositions) return "left-right";
  // // hit left-right boundary
  // if (checkXPosition) return "top-bottom";

  const currentClosetElement = document.elementFromPoint(x, y);
  // console.log({ currentClosetElement });
  if (!currentClosetElement) return "all";
  if (currentClosetElement.className === "") return "all";
  // console.log(currentClosetElement.className, currentClosetElement.id);
  if (
    !currentClosetElement.getAttribute("class")?.includes("grid-item") ||
    currentClosetElement.getAttribute("id") === "active-clone"
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
  // const indicatorSelector = document.querySelector(
  //   "svg#dashed-lines-svg.active-icon"
  // );
  // if (!indicatorSelector) {
  //   const indicator = document.querySelector("svg#dashed-lines-svg");
  //   indicator.classList.add("active-icon");
  //   indicator.classList.add("active-icon");
  //   indicatorSelector.style.left =
  //     parseFloat(event.pageX - indicatorSelector.clientWidth / 2) + "px";
  //   indicatorSelector.style.top =
  //     parseFloat(event.pageY - indicatorSelector.clientHeight / 2) + "px";
  // } else {
  //   indicatorSelector.style.left =
  //     parseFloat(event.pageX - indicatorSelector.clientWidth / 2) + "px";
  //   indicatorSelector.style.top =
  //     parseFloat(event.pageY - indicatorSelector.clientHeight / 2) + "px";
  // }
  // const { width, height } = element.getBoundingClientRect().toJSON();
  const { clientHeight: width, clientWidth: height } = element;

  const canMove = isOverElement(event, element, width, height);
  if (canMove === "all") {
    // element.style.top = event.pageY - height / 3 + "px";
    element.style.top = event.clientY - height / 2 + "px";
    // element.style.left = event.pageX - width / 3 + "px";
    element.style.left = event.clientX - width / 2 + "px";
  }
  if (canMove === "top-bottom") {
    // element.style.top = event.pageY - height / 3 + "px";
    element.style.top = event.pageY - height / 2 + "px";
  }
  if (canMove === "left-right") {
    // element.style.left = event.pageX - width / 3 + "px";
    element.style.left = event.pageX - width / 2 + "px";
  }
  // console.log({
  //   elementTop: element.style.top,
  //   elementLeft: element.style.left,
  //   width,
  //   height,
  //   offsetX: event.offsetX,
  //   offsetY: event.offsetY
  // });
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
  [...GRIDITEMS].forEach((item) => {
    if (
      item.id === "active-clone" ||
      item.classList.contains("dragging-active-item-move")
    )
      return;
    item.classList.remove("pulse");
    item.classList.add("pulse-griditems");
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
    clonedElement.removeEventListener("pointerup", up);
  }
  [...GRIDITEMS].forEach((item) => {
    item.classList.remove("pulse");
    item.classList.remove("pulse-griditems");
  });
  element.removeEventListener("pointermove", move);
  element.classList.remove("dragging-active-item-move");
  element.classList.remove("dragging-active-item-down");
  // optional add the css transition img / svg
  element.querySelector("img").classList.remove("pulse");
  element.releasePointerCapture(event.pointerId);
};

/**
 *
 * @param {PointerEvent} event
 * @returns {HTMLElement} element
 */
const getTargetElementOnDown = (event = {}) => {
  let element;
  if (
    event.target.parentElement.getAttribute("class")?.includes("grid-container")
  ) {
    element = event.target;
  } else {
    element = event.target.parentElement;
  }
  return element;
};

/**
 * @description adds animations and dragging-active-item-down
 * @param {HTMLElement} element
 */
const addClassesOnDown = (element) => {
  // optional add the css transition img / svg
  element.querySelector("img").classList.add("pulse");
  element.classList.add("dragging-active-item-down");
};

/**
 * @description removes animations and dragging-active-item-down
 * @param {HTMLElement} element
 */
const removeClassesFromDown = (element) => {
  element.classList.remove("dragging-active-item-down");
  element.querySelector("img").classList.remove("pulse");
};

/**
 * @description selecting an element on pointer down
 * @param {PointerEvent} event
 */
function down(event) {
  event.preventDefault();
  const element = getTargetElementOnDown(event);
  element.setPointerCapture(event.pointerId);
  addClassesOnDown(element);

  const longPress = setTimeout(() => {
    element.removeEventListener("pointerup", clearTimer);
    [...GRIDITEMS].forEach((item) => {
      item.classList.add("pulse");
    });

    // add our listener events to move and drag
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", (event) => up(event, element), {
      once: true
    });
  }, PRESS_DURATION);

  if (!gridContainer.getAttribute("class")?.includes("active")) {
    gridContainer.classList.add("active");
    // add opacity to grid-container::after
    gridAfterSelector.style.opacity = 1;

    document.body.classList.add("active-body");
    //show our button
    showHideBtn.style.opacity = 1;
    moveViewPortToCenter(event);
  }
  // clear the timer if pointerup event occurs and cancel / remove
  const clearTimer = () => {
    clearTimeout(longPress);
    [...GRIDITEMS].forEach((item) => {
      item.classList.remove("pulse");
    });
    // optional add the css transition img / svg
    removeClassesFromDown(element);
    element.releasePointerCapture(event.pointerId);
  };
  element.addEventListener("pointerup", clearTimer, { once: true });
}

showHideBtn.addEventListener("pointerdown", async (event) => {
  event.stopPropagation();
  if (!gridContainer.getAttribute("class")?.includes("active")) return;
  await moveViewPortToCenter(event);
  gridContainer.classList.remove("active");
  document.body.classList.remove("active-body");
  showHideBtn.style.opacity = 0;
});

darkModeToggle.addEventListener("pointerdown", (event) => {
  event.stopPropagation();
  const getBackgroundStyle = document.body.style.background;
  const setBackgroundStyle = (style) =>
    (document.body.style.background = style);
  const darkStyle = "var(--body-bg-gradient)";
  const lightStyle = "initial";
  const isActive = document.body.classList.contains("active-body");
  if (isActive) {
    document.body.classList.remove("active-body");
    // setBackgroundStyle(lightStyle);
    // return;
  }
  if (!isActive && document.body.classList === "") {
    document.body.classList.add("active-body");
    // setBackgroundStyle(darkStyle);
    return;
  }
  if (getBackgroundStyle === darkStyle) return setBackgroundStyle(lightStyle);
  if (getBackgroundStyle === lightStyle) return setBackgroundStyle(darkStyle);
});

// https://css-tricks.com/how-to-recreate-the-ripple-effect-of-material-design-buttons/
const createRipple = (event) => {
  const button = event.currentTarget;

  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
  circle.classList.add("ripple");

  const ripple = button.getElementsByClassName("ripple")[0];

  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);
};

const buttons = document.getElementsByTagName("button");
for (const button of buttons) {
  button.addEventListener("click", createRipple);
}
const videoSelector = document.querySelector("video");
// const videoPlayBackRate =
videoSelector.playbackRate = 2.5;
videoSelector.addEventListener("ended", (event) => {
  event.preventDefault();
});

window.onpointermove = (event) => {
  const indicatorSelector = document.querySelector(
    "svg#dashed-lines-svg.active-icon"
  );
  if (!indicatorSelector) {
    const indicator = document.querySelector("svg#dashed-lines-svg");
    indicator.classList.add("active-icon");
  } else {
    indicatorSelector.style.left =
      parseFloat(event.pageX - indicatorSelector.clientWidth / 2) + "px";
    indicatorSelector.style.top =
      parseFloat(event.pageY - indicatorSelector.clientHeight / 2) + "px";
    const closestElement = document.elementFromPoint(
      parseInt(indicatorSelector.style.left, 10),
      parseInt(indicatorSelector.style.top, 10)
    );
    // console.log({
    //   closestElement,
    //   left: parseInt(indicatorSelector.style.left, 10),
    //   top: parseInt(indicatorSelector.style.top, 10)
    // });
    if (!closestElement) return;
    // console.log(
    //   closestElement.tagName,
    //   closestElement.className,
    //   closestElement.id
    // );
  }
};
