// import iconsArray from "./Icons";

// scroll to middle of page on load
const scroll = () =>
  window.scrollTo(0, Math.ceil(document.body.clientHeight / 4));
document.body.addEventListener("load", scroll, { once: true });

const gridItems = document.querySelectorAll(".grid-item");
const showHideBtn = document.querySelector(".btn.change-view");
const gridContainer = document.querySelector(".grid-container");
const darkModeToggle = document.querySelector(".btn.dark-mode");

gridItems.forEach((gridItem) => (gridItem.onpointerdown = down));

// add opacity to grid-container::after
const gridAfterSelector = [...document.styleSheets[0].cssRules].find(
  (rule) => rule.selectorText === ".grid-container::after"
);

// // generate random background colors and fonts
// const generateRandomRGBA = () => {
//   let [h, s, l] = Array(3)
//     .fill(0)
//     .map((color, idx) =>
//       idx === 0
//         ? 0 + Math.ceil(Math.random() * 50)
//         : 70 + Math.ceil(Math.random() * 30)
//     );
//   let fontColor = `hsla(${0},${s >= 60 ? 50 : 10}%,${l >= 60 ? 10 : 100}%,1)`;
//   return { rgbaBG: `hsla(${h},${s}%,${l}%,0.8)`, rgbaFontColor: fontColor };
// };

// // label and add styles to grid-items at runtime
// gridItems.forEach((gridItem, index) => {
//   const { rgbaBG, rgbaFontColor } = generateRandomRGBA();
//   const icon = document.createElement("img");
//   gridItem.textContent = "";
//   icon.src = iconsArray[index];
//   icon.height = gridItem.clientWidth / 2;
//   icon.width = gridItem.clientHeight / 2;
//   icon.id = `icon-${index}`;
//   gridItem.appendChild(icon);
//   gridItem.id = index;
//   gridItem.style.backgroundColor = rgbaBG;
//   gridItem.style.color = rgbaFontColor;
//   gridItem.onpointerdown = down;
// });

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
    y <= pageYOffset + top - 150 || y >= height + pageYOffset + top;
  const checkXPosition = x <= left || x >= width + left;
  if (checkXPosition && checkYPositions) {
    // console.log("edge case");
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
  // const { width, height } = element.getBoundingClientRect().toJSON();
  const { clientHeight: width, clientWidth: height } = element;

  const canMove = isOverElement(event, element);
  if (canMove === "all") {
    // element.style.top = event.pageY - height / 3 + "px";
    element.style.top = event.y - height + "px";
    // element.style.left = event.pageX - width / 3 + "px";
    element.style.left = event.x - width + "px";
  }
  if (canMove === "top-bottom") {
    // element.style.top = event.pageY - height / 3 + "px";
    element.style.top = event.y - height + "px";
  }
  if (canMove === "left-right") {
    // element.style.left = event.pageX - width / 3 + "px";
    element.style.left = event.x - width + "px";
  }
  // console.log({ event });
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
  [...gridItems].forEach((item) => {
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
  // optional add the css transition img / svg
  element.querySelector("img").classList.add("pulse");
  element.classList.add("dragging-active-item-down");
  element.setPointerCapture(event.pointerId);

  // from css variable
  const pressDuration = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--animation-duration"
    )
  );
  // from css variable
  const bgGradientOnActive = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--active-bg-gradient");
  const longPress = setTimeout(() => {
    element.removeEventListener("pointerup", clearTimer);
    [...gridItems].forEach((item) => {
      item.classList.add("pulse");
    });

    // add our listener events to move and drag
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", (event) => up(event, element), {
      once: true
    });
  }, pressDuration);
  const gridContainer = document.querySelector(".grid-container");
  if (!gridContainer.classList.contains("active")) {
    window.scrollTo(0, 0);
    console.log(gridContainer.getAttribute("after"));
    gridContainer.classList.add("active");
    // add opacity to grid-container::after
    gridAfterSelector.style.opacity = 1;
    // document.body.style.background = "";

    document.body.classList.add("active-body");
    // remove the scroll
    // document.body.style.overflow = "hidden";
    //show our button
    // const middleOfPage = Math.ceil(document.body.clientHeight / 4);
    const pageWrapperSelector = () => document.querySelector("section");
    let currentPos = event.pageY;
    const point = Math.ceil(
      document.body.clientHeight - pageWrapperSelector().clientHeight
    );
    const moveToCenterInverval = setInterval(() => {
      console.log(currentPos, point, pageWrapperSelector());
      if (currentPos >= point) {
        console.log("clear");
        clearInterval(moveToCenterInverval);
      }
      pageWrapperSelector().scrollIntoView();
      currentPos += 200;
    }, 300);
    showHideBtn.style.opacity = 1;
    // document.body.style.minHeight = window.innerHeight + 50 + "px";
  }
  // clear the timer if pointerup event occurs and cancel / remove
  const clearTimer = () => {
    clearTimeout(longPress);
    [...gridItems].forEach((item) => {
      item.classList.remove("pulse");
    });
    element.classList.remove("dragging-active-item-down");
    // optional add the css transition img / svg
    element.querySelector("img").classList.remove("pulse");
    element.releasePointerCapture(event.pointerId);
  };
  element.addEventListener("pointerup", clearTimer, { once: true });
}

showHideBtn.addEventListener("pointerdown", (event) => {
  event.stopPropagation();
  if (gridContainer.classList.contains("active")) {
    gridContainer.classList.remove("active");
    document.body.style.overflow = "";
    document.body.classList.remove("active-body");
    showHideBtn.style.opacity = 0;
  }
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
  if (!isActive) {
    document.body.classList.add("active-body");
    // setBackgroundStyle(darkStyle);
    // return;
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
const videoPlayBackRate = (videoSelector.playbackRate = 2.5);
videoSelector.addEventListener("ended", (event) => {
  event.defaultPrevented;
});
