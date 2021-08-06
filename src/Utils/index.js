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

export { moveViewPortToCenter };
