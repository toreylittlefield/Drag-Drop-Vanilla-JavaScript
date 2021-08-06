import iconsArray from "./Icons";

// use paths for codesandbox
// import { iconsFilePath } from "./Icons";

const gridItems = document.querySelectorAll(".grid-item");
const [standardGridItem] = gridItems;
const { clientHeight, clientWidth } = standardGridItem;

// generate random background colors and fonts in HSL
const generateRandomRGBA = () => {
  let [h, s, l] = Array(3)
    .fill(0)
    .map((color, idx) =>
      idx === 0
        ? 0 + Math.ceil(Math.random() * 50)
        : 70 + Math.ceil(Math.random() * 30)
    );
  let fontColor = `hsla(${0},${s >= 60 ? 50 : 10}%,${l >= 60 ? 10 : 100}%,1)`;
  return { rgbaBG: `hsla(${h},${s}%,${l}%,0.8)`, rgbaFontColor: fontColor };
};

// label and add styles to grid-items at runtime
gridItems.forEach((gridItem, index) => {
  const { rgbaBG, rgbaFontColor } = generateRandomRGBA();
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
  gridItem.appendChild(icon);
  gridItem.id = index;
  gridItem.style.backgroundColor = rgbaBG;
  gridItem.style.color = rgbaFontColor;
  gridItem.style.opacity = 1;
});
