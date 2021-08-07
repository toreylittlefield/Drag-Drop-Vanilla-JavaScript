import iconsArray from "../Icons";
import { selectors } from "../MapAndClasses";
import { generateRandomHSLA } from "../Utils";
// use paths for codesandbox
// import { iconsFilePath } from "./Icons";

const [standardGridItem] = gridItems;
const { clientHeight, clientWidth } = standardGridItem;



// label and add styles to grid-items at runtime
[...selectors.GRID_ITEMS.forEach((gridItem, index) => {
  const { hslaBackgroundColor, hslaFontColor } = generateRandomHSLA();
  const icon = document.createElement("img");
  gridItem.textContent = "";
  // for codesandbox use **
  //*********************//
  // icon.src = iconsFilePath[index];
  //*********************//
  icon.src = iconsArray[index];
  icon.type = "image/svg+xml";
  icon.height = clientHeight / 2;
  icon.width = clientWidth / 2;
  icon.id = `icon-${index}`;
  icon.alt = icon.src
  gridItem.appendChild(icon);
  gridItem.id = index;
  gridItem.style.backgroundColor = hslaBackgroundColor;
  gridItem.style.color = hslaFontColor;
  gridItem.style.opacity = 1;
});
