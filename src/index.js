import { moveViewPortToCenter } from "./Utils";

/**
 * @description map with classnames and ids
 */
class classNamesAndId {
  static _gridItemClass = ".grid-item";
  static _gridContainerClass = ".grid-container";
  static _gridContainerAfterClass = ".grid-container::after";
  static _activeCloneId = "#active-clone";
  static _btnViewClass = ".btn.change-view";
  static _btnDarkModeClass = ".btn.dark-mode";
  static _pressDurationCSSVar = "--animation-duration-flip";
}
const {
  _gridItemClass,
  _gridContainerClass,
  _gridContainerAfterClass,
  _activeCloneId,
  _btnViewClass,
  _btnDarkModeClass,
  _pressDurationCSSVar
} = classNamesAndId;

const GRID_ITEMS = document.querySelectorAll(_gridItemClass);
const GRID_CONTAINER = document.querySelector(_gridContainerClass);
const activeClonedElementSelector = () =>
  document.querySelector(_activeCloneId);
const showHideBtn = document.querySelector(_btnViewClass);
const darkModeToggle = document.querySelector(_btnDarkModeClass);

/**
 * @description returns the --animation-duration-flip duration from css stylesheet
 * @returns {Number} PRESS_DURATION is in ms
 */
const PRESS_DURATION = Math.ceil(
  parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      _pressDurationCSSVar
    ),
    10
  )
);

// Scroll to middle of grid container
(() => {
  console.log("scrolled on load");
  window.scrollTo(0, Math.ceil(window.innerWidth / 2));
})();

/**
 * @description add pointerdown event listeners
 */
[...GRID_ITEMS].forEach((gridItem) => (gridItem.onpointerdown = down));

/**
 * @description add opacity to grid-container::after
 */
const gridAfterSelector = [...document.styleSheets[0].cssRules].find(
  (rule) => rule.selectorText === _gridContainerAfterClass
);

/**
 * @description swaps in the DOM the cloned element with the grid-item that the pointer is currently over
 * @param {PointerEvent} event
 * @param {HTMLElement} element
 * @returns {{all: Boolean}} moveDirection
 *
 */
const isOverElement = (
  event = PointerEvent,
  element = HTMLElement,
  width = 0,
  height = 0
) => {
  const moveDirection = { all: true };
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
  if (!currentClosetElement) return moveDirection;
  if (currentClosetElement.className === "") return moveDirection;
  // console.log(currentClosetElement.className, currentClosetElement.id);
  if (
    !currentClosetElement.getAttribute("class")?.includes("grid-item") ||
    currentClosetElement.getAttribute("id") === "active-clone"
  )
    return moveDirection;
  const clondedNode = document.querySelector(_activeCloneId);
  const clonedCopy = clondedNode.cloneNode();
  currentClosetElement.replaceWith(clonedCopy);
  clondedNode.replaceWith(currentClosetElement);
  return moveDirection;
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

  const { all } = isOverElement(event, element, width, height);

  if (all) {
    // element.style.top = event.pageY - height / 3 + "px";
    element.style.top = event.clientY - height / 2 + "px";
    // element.style.left = event.pageX - width / 3 + "px";
    element.style.left = event.clientX - width / 2 + "px";
  }
  // if (canMove === "top-bottom") {
  //   // element.style.top = event.pageY - height / 3 + "px";
  //   element.style.top = event.pageY - height / 2 + "px";
  // }
  // if (canMove === "left-right") {
  //   // element.style.left = event.pageX - width / 3 + "px";
  //   element.style.left = event.pageX - width / 2 + "px";
  // }
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
  addOrRemoveClassFromGridItems(
    { add: "pulse-griditems", remove: "pulse" },
    { id: "active-clone", className: "dragging-active-item-move" }
  );
};

/**
 * @description replace the
 * @param {HTMLElement} element the element to replace with the active clone
 */
const removeAndReplaceActiveClone = (element) => {
  const activeClone = activeClonedElementSelector();
  if (!activeClone) return;
  activeClone.replaceWith(element);
  activeClone.remove();
};

/**
 * @description releasing the pointer i.e. mouse or touch
 * @param {PointerEvent} event
 * @param {HTMLElement} element
 */
const up = (event, element) => {
  removeAndReplaceActiveClone(element);
  addOrRemoveClassFromGridItems({ remove: ["pulse", "pulse-griditems"] });
  element.removeEventListener("pointermove", move);
  element.classList.remove("dragging-active-item-move");
  element.classList.remove("dragging-active-item-down");
  element.style.top = "";
  element.style.left = "";
  // optional add the css transition img / svg
  element.querySelector("img").classList.remove("pulse");
  element.releasePointerCapture(event.pointerId);
};

/**
 * @description return the grid-item element on pointerdown
 * @param {PointerEvent} event
 * @returns {HTMLElement} element
 */
const getTargetElementOnDown = (event = {}) => {
  const { parentElement } = event.target;
  if (parentElement.getAttribute("class")?.includes("grid-container"))
    return event.target;
  return parentElement;
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
 *
 * @param {Object} Object - or remove a target classname
 * @param {(string|string[])} Object.add - add classnames to all grid-items
 * @param {(string|string[])} Object.remove - remove classnames to all grid items
 * @param {Object)} conditions set conditional arguments
 * @param {string} conditions.id the item id from the element to skip
 * @param {string)} conditions.className the classname from the element to skip
 */
const addOrRemoveClassFromGridItems = (
  { add = "" || [], remove = "" || [] },
  _conditions = { id: "", className: "" }
) => {
  const { id, className } = _conditions;
  if (typeof add === "string") add = [add];
  if (typeof remove === "remove") remove = [remove];

  [...GRID_ITEMS].forEach((item) => {
    const classList = item.classList;
    if (id && item.getAttribute("id") === id) return;
    if (className && item.getAttribute("class").includes(className)) return;
    if (add) classList.add(...add);
    if (remove) classList.remove(...remove);
  });
};

/**
 * @description selecting an element, our grid-items, on pointer down listener
 * @param {PointerEvent} event
 */
function down(event) {
  event.preventDefault();
  const element = getTargetElementOnDown(event);
  element.setPointerCapture(event.pointerId);
  addClassesOnDown(element);

  const longPressToMove = setTimeout(() => {
    element.removeEventListener("pointerup", clearTimer);
    addOrRemoveClassFromGridItems({ add: "pulse" });

    // add our listener events to move and drag
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", (event) => up(event, element), {
      once: true
    });
  }, PRESS_DURATION);

  if (!GRID_CONTAINER.getAttribute("class")?.includes("active")) {
    GRID_CONTAINER.classList.add("active");
    // add opacity to grid-container::after
    gridAfterSelector.style.opacity = 1;

    document.body.classList.add("active-body");
    //show our button
    showHideBtn.style.opacity = 1;
    moveViewPortToCenter(event);
  }
  // clear the timer if pointerup event occurs and cancel / remove
  const clearTimer = () => {
    clearTimeout(longPressToMove);
    addOrRemoveClassFromGridItems({ remove: "pulse" });
    removeClassesFromDown(element);
    element.releasePointerCapture(event.pointerId);
  };
  element.addEventListener("pointerup", clearTimer, { once: true });
}

showHideBtn.addEventListener("pointerdown", async (event) => {
  event.stopPropagation();
  if (!GRID_CONTAINER.getAttribute("class")?.includes("active")) return;
  await moveViewPortToCenter(event);
  GRID_CONTAINER.classList.remove("active");
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
