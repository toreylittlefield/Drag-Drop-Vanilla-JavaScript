import iconsArray from "../Icons";
import { selectors } from "../MapAndClasses";
import { generateRandomHSLA, getAltImgString } from "../Utils";
// use paths for codesandbox
// import { iconsFilePath } from "./Icons";

// label and add styles to grid-items at runtime
selectors.GRID_ITEMS.forEach((gridItem, index) => {
  const { hslaBackgroundColor, hslaFontColor } = generateRandomHSLA();
  const icon = document.createElement("img");
  gridItem.textContent = "";
  // for codesandbox use **
  //*********************//
  // icon.src = iconsFilePath[index];
  //*********************//
  icon.src = iconsArray[index];
  icon.type = "image/svg+xml";
  icon.id = `icon-${index}`;
  icon.alt = getAltImgString(icon);
  gridItem.appendChild(icon);
  gridItem.id = index;
  gridItem.style.backgroundColor = hslaBackgroundColor;
  gridItem.style.color = hslaFontColor;
  gridItem.style.opacity = 1;
});
