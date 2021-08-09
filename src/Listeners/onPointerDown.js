import { moveViewPortToCenter, addOrRemoveClassFromGridItems } from "../Utils";
import {
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
} from "../MapAndClasses";
import { up } from "./onPointerUp";
import { move } from "./OnPointerMove";

const { GRID_CONTAINER, showHideBtn } = selectors;

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
export const down = (event) => {
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
    GRID_CONTAINER.classList.add(_activeClassNameStr, "will-change");
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
