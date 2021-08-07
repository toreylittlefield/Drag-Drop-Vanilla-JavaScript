import { down } from "./Listeners/onPointerDown";
import onWindowLoad from "./Listeners/onWindowLoad";
import {
  moveViewPortToCenter,
  scrollOnLoad,
  addOrRemoveClassFromGridItems
} from "./Utils";
import activeMoveCSSIndex, {
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
  _dragActiveDownClassNameStr,
  selectors,
  PRESS_DURATION,
  gridAfterSelector
} from "./MapAndClasses";

const {
  GRID_ITEMS,
  GRID_CONTAINER,
  activeClonedElementSelector,
  showHideBtn,
  darkModeToggle
} = selectors;

scrollOnLoad();

onWindowLoad(down);
