import { selectors } from "../MapAndClasses";

/**
 * @description Move the viewport to the center of the page using an interval
 * @param {PointerEvent}
 */
export const moveViewPortToCenter = (event) => {
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
export const createRipple = (event) => {
  const button = event.currentTarget;
  const { left, top } = button.getBoundingClientRect();
  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - left - radius}px`;
  circle.style.top = `${event.clientY - top - radius}px`;
  circle.classList.add("ripple");

  const ripple = button.getElementsByClassName("ripple")[0];

  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);
};

/**
 * @description scroll to near the middle of the page on load or at the top for portrait
 */
export const scrollOnLoad = () => {
  console.log(window.screen.orientation.type);
  // # create modal to ask user to enter fullscreen-landscape
  if (window.screen.orientation.type.startsWith("portrait"))
    return window.scrollTo(0, 1);
  window.scrollTo(0, Math.ceil(window.innerWidth / 2));
  console.log("scrolled on load");
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
export const addOrRemoveClassFromGridItems = (
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

/**
 * @description generate random background colors and fonts in hsla
 * @returns {{hslaBackgroundColor: string,  hslaFontColor: fontColor}}
 */
export const generateRandomHSLA = () => {
  let [h, s, l] = Array(3)
    .fill(0)
    .map((color, idx) =>
      idx === 0
        ? 0 + Math.ceil(Math.random() * 50)
        : 70 + Math.ceil(Math.random() * 30)
    );
  let fontColor = `hsla(${0},${s >= 60 ? 50 : 10}%,${l >= 60 ? 10 : 100}%,1)`;
  return {
    hslaBackgroundColor: `hsla(${h},${s}%,${l}%,0.8)`,
    hslaFontColor: fontColor
  };
};

/**
 * @description Enter and Exit Full Screen Mode
 * @link https://developers.google.com/web/fundamentals/native-hardware/fullscreen
 *
 */
export const toggleFullScreen = () => {
  const doc = window.document;
  const docEl = doc.documentElement;

  const requestFullScreen =
    docEl.requestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.webkitRequestFullScreen ||
    docEl.msRequestFullscreen;
  const cancelFullScreen =
    doc.exitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitExitFullscreen ||
    doc.msExitFullscreen;

  if (
    !doc.fullscreenElement &&
    !doc.mozFullScreenElement &&
    !doc.webkitFullscreenElement &&
    !doc.msFullscreenElement
  ) {
    requestFullScreen.call(docEl);
    window.screen.orientation.lock("landscape");
  } else {
    cancelFullScreen.call(doc);
  }
};

/**
 *
 * @param {HTMLElement} icon Icon with a filename that can be used to derive the alt attribute from the file name string
 * @returns {string} a string to be used as the alt attribute
 */
export const getAltImgString = (icon = HTMLElement) => {
  try {
    const srcNameArr = icon.src?.split("/");
    const iconName = srcNameArr[srcNameArr.length - 1]?.split(".")[0];
    return `${iconName} icon`;
  } catch (error) {
    console.error("could not split src into an alt name");
    return "mobile icon";
  }
};
