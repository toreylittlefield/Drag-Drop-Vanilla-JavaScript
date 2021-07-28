import "./styles.css";

const gridItems = document.querySelectorAll(".grid-item");

function allowDrop(ev) {
  console.log({ ev });
  ev.preventDefault();
}

const move = (event) => {
  const element = event.target;
  addRemoveClonedNode(element, false);
  console.log("move");

  element.style.position = "absolute";
  element.style.top = event.pageY + "px";
  element.style.left = event.pageX + "px";
};

const up = (event, element) => {
  console.log("up");
  element.removeEventListener("pointermove", move);
  addRemoveClonedNode(null, true);
  const body = document.body;
  body.append(element);
  element.releasePointerCapture(event.pointerId);
  element.removeEventListener("pointerup", up);
};

const addRemoveClonedNode = (element, removed) => {
  console.log("out");
  if (removed) {
    const clonedActive = document.getElementById("active-clone");
    if (clonedActive) clonedActive.remove();
    return;
  }
  if (element?.style.position === "absolute") return;

  const nextSibling = element.nextElementSibling;
  const clonedElement = element.cloneNode();
  clonedElement.id = "active-clone";
  console.log({ element });
  if (nextSibling) nextSibling.before(clonedElement);
  if (!nextSibling) element.parentElement.append(clonedElement);
};

function drag(event) {
  const element = event.target;

  element.setPointerCapture(event.pointerId);
  element.style.transform = `scale(1.25)`;
  console.log({ event });

  element.addEventListener("pointermove", move);
  element.addEventListener("pointerup", (event) => {
    up(event, element);
  });

  // console.log({ element });
  // ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  console.log({ ev });
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}

const generateRandomRGBA = () => {
  let [h, s, l] = Array(3)
    .fill(0)
    .map((color, idx) =>
      idx === 0
        ? Math.ceil(Math.random() * 365)
        : Math.ceil(Math.random() * 100)
    );
  let fontColor = `hsla(${0},${s >= 60 ? 50 : 10}%,${l >= 60 ? 10 : 100}%,1)`;
  return { rgbaBG: `hsla(${h},${s}%,${l}%,0.8)`, rgbaFontColor: fontColor };
};

gridItems.forEach((gridItem, index) => {
  const { rgbaBG, rgbaFontColor } = generateRandomRGBA();
  gridItem.id = index;
  gridItem.style.backgroundColor = rgbaBG;
  gridItem.style.color = rgbaFontColor;

  gridItem.onpointerdown = drag;
  // gridItem.addEventListener("ondragover", allowDrop);
  // gridItem.addEventListener("ondrop", drop);
});
