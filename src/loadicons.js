import iconsArray from "./Icons";

const gridItems = document.querySelectorAll(".grid-item");
// generate random background colors and fonts
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

const [standardGridItem] = gridItems;
const { clientHeight, clientWidth } = standardGridItem;
// label and add styles to grid-items at runtime
gridItems.forEach((gridItem, index) => {
  const { rgbaBG, rgbaFontColor } = generateRandomRGBA();
  const icon = document.createElement("img");
  gridItem.textContent = "";
  icon.src = iconsArray[index];
  icon.height = clientWidth / 2;
  icon.width = clientWidth / 2;
  icon.id = `icon-${index}`;
  gridItem.appendChild(icon);
  gridItem.id = index;
  gridItem.style.backgroundColor = rgbaBG;
  gridItem.style.color = rgbaFontColor;
  gridItem.style.opacity = 1;
});
