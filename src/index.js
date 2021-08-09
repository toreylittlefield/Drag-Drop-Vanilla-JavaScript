import { down } from "./Listeners/onPointerDown";
import onWindowLoad from "./Listeners/onWindowLoad";
import { scrollOnLoad } from "./Utils";
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
  _dragActiveDownClassNameStr
} from "./MapAndClasses";

scrollOnLoad();

onWindowLoad(down);

const btnFabSelector = document.querySelector(".btn.fab");
console.log(btnFabSelector);
const overlaySelector = document.querySelector(".overlay");
const fablistSelector = document.querySelector(".fab-list");
const fabListButtonsSelector = document.querySelectorAll(".fab-list button");
btnFabSelector.onpointerdown = (event) => {
  event.stopPropagation();
  overlaySelector.classList.toggle("open");
  const open = fablistSelector.classList.toggle("open");
  let rotateAngle = 5;
  let transitionTime = 300;
  fabListButtonsSelector.forEach((button) => {
    const transition = `transition: all ${transitionTime}ms ease ${transitionTime}ms`;
    const translateXCSS = `translateX(-150%)`;
    const cssText = `transform: rotate(${-rotateAngle}deg) ${translateXCSS}; ${transition};`;
    if (open) {
      button.parentElement.style.cssText = cssText;
      button.style.cssText = `transform: rotate(${rotateAngle}deg); ${transition};`;
    } else {
      button.parentElement.style.cssText = `transform: rotate(0deg) translateX(0); ${transition};`;
      button.style.cssText = `transform: rotate(0deg); ${transition};`;
    }
    rotateAngle -= 50;
    transitionTime += 300;
  });
};
