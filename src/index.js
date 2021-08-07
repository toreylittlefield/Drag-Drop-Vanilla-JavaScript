import {
  moveViewPortToCenter,
  createRipple,
  scrollOnLoad,
  addOrRemoveClassFromGridItems
} from "./Utils";
import activeMoveCSSIndex, {
  _gridItemClass,
  _gridContainerClass,
  _gridContainerAfterClass,
  _activeCloneId,
  _btnViewClass,
  _btnDarkModeClass,
  _pressDurationCSSVar,
  _darkModeCSSVar,
  _draggingActiveItemMoveClass,
  _activeClassNameStr,
  _activeBodyClassNameStr,
  _pulseAnimationClassNameStr,
  _pulseGridClassNameStr,
  _gridItemClassNameStr,
  _gridContainerClassNameStr,
  _activeCloneIdStr,
  _dragMoveClassNameStr,
  _dragActiveDownClassNameStr,
  selectors,
  PRESS_DURATION,
  gridAfterSelector
} from "./MapAndClasses";
import onWindowLoad from "./Listeners/onWindowLoad";

const {
  GRID_ITEMS,
  GRID_CONTAINER,
  activeClonedElementSelector,
  showHideBtn,
  darkModeToggle
} = selectors;

scrollOnLoad();

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
  const x = event.clientX - height / 2;
  const y = event.clientY - width / 2;

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
  const { clientHeight: width, clientWidth: height } = element;
  const { all } = isOverElement(event, element, width, height);
  if (all) {
    activeMoveCSSIndex.top = event.clientY - height / 2 + "px";
    activeMoveCSSIndex.left = event.clientX - width / 2 + "px";
  }
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
 * @description adds or remove animations and dragging-active-item-down
 * @param {HTMLElement} element
 */
const toggleClassesInDownEvent = (element) => {
  element.classList.toggle(_dragActiveDownClassNameStr);
  element.querySelector("img").classList.toggle(_pulseAnimationClassNameStr);
};

/**
 * @description selecting an element, our grid-items, on pointer down listener
 * @param {PointerEvent} event
 */
const down = (event) => {
  event.preventDefault();
  const element = getTargetElementOnDown(event);
  element.setPointerCapture(event.pointerId);
  toggleClassesInDownEvent(element);

  const vibrationDelay = 500;
  // const vibrationPatternArray = [300, 100, 500, 100, 300];
  const startVibrate = (duration) => navigator.vibrate(duration);
  const vibrationDelayTimer = setInterval(() => {
    startVibrate([300]);
  }, vibrationDelay);

  // const makeA
  if (!GRID_CONTAINER.getAttribute("class")?.includes(_activeClassNameStr)) {
    GRID_CONTAINER.classList.add(_activeClassNameStr);
    // add opacity to grid-container::after for shine effect
    gridAfterSelector.style.opacity = 1;
    //show our button
    showHideBtn.style.opacity = 1;

    document.body.classList.add(_activeBodyClassNameStr);
    moveViewPortToCenter(event);
  }

  const longPressToMove = setTimeout(() => {
    element.removeEventListener("pointerup", clearLongPressTimer);
    clearInterval(vibrationDelayTimer);
    navigator.vibrate(200);
    addOrRemoveClassFromGridItems({ add: _pulseAnimationClassNameStr });

    // add our listener events to move and drag
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", (event) => up(event, element), {
      once: true
    });
  }, PRESS_DURATION);

  // clear the timer if pointerup event occurs and cancel / remove
  const clearLongPressTimer = () => {
    clearTimeout(longPressToMove);
    clearInterval(vibrationDelayTimer);
    addOrRemoveClassFromGridItems({ remove: _pulseAnimationClassNameStr });
    toggleClassesInDownEvent(element);
    element.releasePointerCapture(event.pointerId);
  };
  element.addEventListener("pointerup", clearLongPressTimer, { once: true });
};

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

onWindowLoad(down);
