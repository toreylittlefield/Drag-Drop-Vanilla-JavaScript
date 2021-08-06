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

export { moveViewPortToCenter, createRipple };
