import { selectors } from "../MapAndClasses";

/**
 * @description Move the viewport to the center of the page using an interval
 * @param {PointerEvent}
 */
const moveViewPortToCenter = (event) => {
  return new Promise((resolve) => {
    const pageWrapperSelector = () => document.querySelector("section");
    let currentPos = event.pageY;
    const point = Math.ceil(
      document.body.clientHeight - pageWrapperSelector().clientHeight
    );
    const moveToCenterInverval = setInterval(() => {
      if (currentPos >= point) {
        resolve(currentPos);
        clearInterval(moveToCenterInverval);
      }
      pageWrapperSelector().scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center"
      });
      currentPos += 60;
    }, 10);
  });
};

/**
 * @description creates the "ripple effect" for buttons
 * @link https://css-tricks.com/how-to-recreate-the-ripple-effect-of-material-design-buttons/
 * @param {Event} event
 */
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

/**
 * @description scroll to near the middle of the page on load
 */
const scrollOnLoad = () => {
  console.log("scrolled on load");
  window.scrollTo(0, Math.ceil(window.innerWidth / 2));
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

  [...selectors.GRID_ITEMS].forEach((item) => {
    const classList = item.classList;
    if (id && item.getAttribute("id") === id) return;
    if (className && item.getAttribute("class").includes(className)) return;
    if (add) classList.add(...add);
    if (remove) classList.remove(...remove);
  });
};

export {
  moveViewPortToCenter,
  createRipple,
  scrollOnLoad,
  addOrRemoveClassFromGridItems
};
