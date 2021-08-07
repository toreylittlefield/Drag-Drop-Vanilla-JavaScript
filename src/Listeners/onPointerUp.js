import { addOrRemoveClassFromGridItems } from "../Utils";
import { move } from "./OnPointerMove";
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
  selectors
} from "../MapAndClasses";

const { activeClonedElementSelector } = selectors;

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
export const up = (event, element) => {
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
