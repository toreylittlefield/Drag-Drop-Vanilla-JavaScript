import { selectors } from "../MapAndClasses";
import { createRipple } from "../Utils";
import { buttonsActions } from "../Actions/Buttons";
import { resizeImgsOnOrientationChange } from "./onOrientationChange";

export default (down = () => {}) => {
  window.onload = () => {
    const buttons = document.getElementsByTagName("button");
    for (const button of buttons) {
      button.addEventListener("click", createRipple);
    }
    buttonsActions();

    resizeImgsOnOrientationChange();

    const videoSelector = document.querySelector("video");
    videoSelector.playbackRate = 2.5;

    /**
     * @description add pointerdown event listeners
     */
    [...selectors.GRID_ITEMS].forEach(
      (gridItem) => (gridItem.onpointerdown = down)
    );

    // window.onpointermove = (event) => {
    //   const indicatorSelector = document.querySelector(
    //     "svg#dashed-lines-svg.active-icon"
    //   );
    //   if (!indicatorSelector) {
    //     const indicator = document.querySelector("svg#dashed-lines-svg");
    //     indicator.classList.add("active-icon");
    //   } else {
    //     indicatorSelector.style.left =
    //       parseFloat(event.pageX - indicatorSelector.clientWidth / 2) + "px";
    //     indicatorSelector.style.top =
    //       parseFloat(event.pageY - indicatorSelector.clientHeight / 2) + "px";
    //     const closestElement = document.elementFromPoint(
    //       parseInt(indicatorSelector.style.left, 10),
    //       parseInt(indicatorSelector.style.top, 10)
    //     );
    //   }
    // };
  };
};
