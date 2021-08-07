import { addOrRemoveClassFromGridItems } from "../Utils";
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
  _dragActiveDownClassNameStr
} from "../MapAndClasses";

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
export const move = (event) => {
  const element = event.target;
  addRemoveClonedNode(element, false);
  const { clientHeight: width, clientWidth: height } = element;
  const { all } = isOverElement(event, element, width, height);
  if (all) {
    activeMoveCSSIndex.top = event.clientY - height / 2 + "px";
    activeMoveCSSIndex.left = event.clientX - width / 2 + "px";
  }
};
