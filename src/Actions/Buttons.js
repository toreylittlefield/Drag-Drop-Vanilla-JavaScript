import { toggleFullScreen, moveViewPortToCenter } from "../Utils";
import {
  _activeClassNameStr,
  _activeBodyClassNameStr,
  _darkModeCSSVar,
  selectors
} from "../MapAndClasses/";

export const buttonsActions = () => {
  const { GRID_CONTAINER, showHideBtn, darkModeToggle, fullScreenBtn } =
    selectors;

  showHideBtn.addEventListener("pointerdown", async (event) => {
    event.stopPropagation();
    if (!GRID_CONTAINER.getAttribute("class")?.includes(_activeClassNameStr))
      return;
    await moveViewPortToCenter(event);
    GRID_CONTAINER.classList.remove(_activeClassNameStr);
    document.body.classList.remove(_activeBodyClassNameStr);
    showHideBtn.style.opacity = 0;
  });

  darkModeToggle.addEventListener("pointerdown", (event) => {
    event.stopPropagation();
    const getBackgroundStyle = document.body.style.background;
    const setBackgroundStyle = (style) =>
      (document.body.style.background = style);
    const lightStyle = "initial";
    const isActive = document.body.classList.contains(_activeBodyClassNameStr);
    if (isActive) {
      document.body.classList.remove(_activeBodyClassNameStr);
      // setBackgroundStyle(lightStyle);
      // return;
    }
    if (!isActive && document.body.classList === "") {
      document.body.classList.add(_activeBodyClassNameStr);
      // setBackgroundStyle(darkStyle);
      return;
    }
    if (getBackgroundStyle === _darkModeCSSVar)
      return setBackgroundStyle(lightStyle);
    if (getBackgroundStyle === lightStyle)
      return setBackgroundStyle(_darkModeCSSVar);
  });

  fullScreenBtn.onclick = toggleFullScreen;
};
