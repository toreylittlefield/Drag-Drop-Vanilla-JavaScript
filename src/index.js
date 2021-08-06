import { moveViewPortToCenter, createRipple, scrollOnLoad } from "./Utils";

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
  static _darkModeCSSVar = "var(--body-bg-gradient)";
  static _draggingActiveItemMoveClass = ".dragging-active-item-move";
  static _activeBodyClassNameStr = "active-body";
  static _activeClassNameStr = "active";
  static _pulseAnimationClassNameStr = "pulse";
  static _pulseGridClassNameStr = "pulse-griditems";
  static _gridItemClassNameStr = this._gridItemClass.substr(1);
  static _gridContainerClassNameStr = this._gridContainerClass.substr(1);
  static _activeCloneIdStr = this._activeCloneId.substr(1);
  static _dragMoveClassNameStr = this._draggingActiveItemMoveClass.substr(1);
  static _dragActiveDownClassNameStr = "dragging-active-item-down";
  activeMoveCSSIndex() {
    return [...document.styleSheets[0].cssRules].find(
      (rule) => rule.selectorText === _draggingActiveItemMoveClass
    ).style;
  }
}

const {
  _gridItemClass,
  _gridContainerClass,
  _gridContainerAfterClass,
  _activeCloneId,
  _btnViewClass,
  _btnDarkModeClass,
  _pressDurationCSSVar,
  _draggingActiveItemMoveClass,
  _activeClassNameStr,
  _activeBodyClassNameStr,
  _pulseAnimationClassNameStr,
  _pulseGridClassNameStr,
  _gridItemClassNameStr,
  _gridContainerClassNameStr,
  _activeCloneIdStr,
  _dragMoveClassNameStr,
  _dragActiveDownClassNameStr
} = classNamesAndId;
const activeMoveCSSIndex = new classNamesAndId().activeMoveCSSIndex();

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
scrollOnLoad();

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
  if (!currentClosetElement) return moveDirection;
  if (currentClosetElement.className === "") return moveDirection;
  if (
    !currentClosetElement
      .getAttribute("class")
      ?.includes(_gridItemClassNameStr) ||
    currentClosetElement.getAttribute("id") === _activeCloneIdStr
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
    console.log(activeMoveCSSIndex);
    console.log(activeMoveCSSIndex["top"]);
    activeMoveCSSIndex.top = event.clientY - height / 2 + "px";
    activeMoveCSSIndex.left = event.clientX - width / 2 + "px";
    // element.style.top = event.pageY - height / 3 + "px";
    // element.style.top = event.clientY - height / 2 + "px";
    // element.style.left = event.pageX - width / 3 + "px";
    // element.style.left = event.clientX - width / 2 + "px";
    // console.log(element.style.cssText);
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
  if (element.classList.contains(_dragMoveClassNameStr)) return;

  const nextSibling = element.nextElementSibling;
  const clonedElement = element.cloneNode();
  clonedElement.id = _activeCloneIdStr;
  element.classList.add(_dragMoveClassNameStr);
  if (nextSibling) nextSibling.before(clonedElement);
  if (!nextSibling) element.parentElement.append(clonedElement);
  addOrRemoveClassFromGridItems(
    { add: _pulseGridClassNameStr, remove: _pulseAnimationClassNameStr },
    { id: _activeCloneIdStr, className: _dragMoveClassNameStr }
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
  addOrRemoveClassFromGridItems({
    remove: [_pulseAnimationClassNameStr, _pulseGridClassNameStr]
  });
  element.removeEventListener("pointermove", move);
  element.classList.remove(_dragMoveClassNameStr);
  element.classList.remove(_dragActiveDownClassNameStr);
  element.style.top = "";
  element.style.left = "";
  // optional add the css transition img / svg
  element.querySelector("img").classList.remove(_pulseAnimationClassNameStr);
  element.releasePointerCapture(event.pointerId);
};

/**
 * @description return the grid-item element on pointerdown
 * @param {PointerEvent} event
 * @returns {HTMLElement} element
 */
const getTargetElementOnDown = (event = {}) => {
  const { parentElement } = event.target;
  if (parentElement.getAttribute("class")?.includes(_gridContainerClassNameStr))
    return event.target;
  return parentElement;
};

/**
 * @description adds animations and dragging-active-item-down
 * @param {HTMLElement} element
 */
const addClassesOnDown = (element) => {
  // optional add the css transition img / svg
  element.querySelector("img").classList.add(_pulseAnimationClassNameStr);
  element.classList.add(_dragActiveDownClassNameStr);
};

/**
 * @description removes animations and dragging-active-item-down
 * @param {HTMLElement} element
 */
const removeClassesFromDown = (element) => {
  element.classList.remove(_dragActiveDownClassNameStr);
  element.querySelector("img").classList.remove(_pulseAnimationClassNameStr);
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
    addOrRemoveClassFromGridItems({ add: _pulseAnimationClassNameStr });

    // add our listener events to move and drag
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", (event) => up(event, element), {
      once: true
    });
  }, PRESS_DURATION);

  if (!GRID_CONTAINER.getAttribute("class")?.includes(_activeClassNameStr)) {
    GRID_CONTAINER.classList.add(_activeClassNameStr);
    // add opacity to grid-container::after
    gridAfterSelector.style.opacity = 1;

    document.body.classList.add(_activeBodyClassNameStr);
    //show our button
    showHideBtn.style.opacity = 1;
    moveViewPortToCenter(event);
  }
  // clear the timer if pointerup event occurs and cancel / remove
  const clearTimer = () => {
    clearTimeout(longPressToMove);
    addOrRemoveClassFromGridItems({ remove: _pulseAnimationClassNameStr });
    removeClassesFromDown(element);
    element.releasePointerCapture(event.pointerId);
  };
  element.addEventListener("pointerup", clearTimer, { once: true });
}

showHideBtn.addEventListener("pointerdown", async (event) => {
  event.stopPropagation();
  if (!GRID_CONTAINER.getAttribute("class")?.includes(_activeClassNameStr))
    return;
  await moveViewPortToCenter(event);
  GRID_CONTAINER.classList.remove(_activeClassNameStr);
  document.body.classList.remove(_activeBodyClassNameStr);
  showHideBtn.style.opacity = 0;
});

darkModeToggle.addEventListener("pointerdown", (event) => {
  event.stopPropagation();
  const getBackgroundStyle = document.body.style.background;
  const setBackgroundStyle = (style) =>
    (document.body.style.background = style);
  const lightStyle = "initial";
  const isActive = document.body.classList.contains(_activeBodyClassNameStr);
  if (isActive) {
    document.body.classList.remove(_activeBodyClassNameStr);
    // setBackgroundStyle(lightStyle);
    // return;
  }
  if (!isActive && document.body.classList === "") {
    document.body.classList.add(_activeBodyClassNameStr);
    // setBackgroundStyle(darkStyle);
    return;
  }
  if (getBackgroundStyle === _darkModeCSSVar)
    return setBackgroundStyle(lightStyle);
  if (getBackgroundStyle === lightStyle)
    return setBackgroundStyle(_darkModeCSSVar);
});

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
