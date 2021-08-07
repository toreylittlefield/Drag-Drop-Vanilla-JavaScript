import { _gridItemClass, _gridIconSelector } from "../MapAndClasses";

export const resizeImgsOnOrientationChange = () =>
  window.screen.orientation.addEventListener(
    "change",
    (event) => {
      const getGridItem = document.querySelector(_gridItemClass);
      const { clientHeight, clientWidth } = getGridItem;
      const gridItemIcons = document.querySelectorAll(
        `${_gridItemClass} ${_gridIconSelector}`
      );
      gridItemIcons.forEach((icon) => {
        icon.height = clientHeight / 2;
        icon.width = clientWidth / 2;
      });
    },
    { passive: true }
  );
