/**
 * @description static (Read-only) map with classnames and ids
 */
class classNamesAndId {
  static _gridItemClass = ".grid-item";
  static _gridContainerClass = ".grid-container";
  static _gridContainerAfterClass = ".grid-container::after";
  static _activeCloneId = "#active-clone";
  static _btnViewClass = ".btn.change-view";
  static _btnDarkModeClass = ".btn.dark-mode";
  static _pressDurationCSSVar = "--animation-duration-flip";
  static _darkModeCSSVar = "var(--body-bg-gradient)";
  static _draggingActiveItemMoveClass = ".dragging-active-item-move";
  static _activeBodyClassNameStr = "active-body";
  static _activeClassNameStr = "active";
  static _pulseAnimationClassNameStr = "pulse";
  static _pulseGridClassNameStr = "pulse-griditems";
  static _gridItemClassNameStr = this._gridItemClass.substr(1);
  static _gridContainerClassNameStr = this._gridContainerClass.substr(1);
  static _activeCloneIdStr = this._activeCloneId.substr(1);
  static _dragMoveClassNameStr = this._draggingActiveItemMoveClass.substr(1);
  static _dragActiveDownClassNameStr = "dragging-active-item-down";
  activeMoveCSSIndex() {
    return [...document.styleSheets[0].cssRules].find(
      (rule) => rule.selectorText === _draggingActiveItemMoveClass
    ).style;
  }
}

export const {
  _gridItemClass,
  _gridContainerClass,
  _gridContainerAfterClass,
  _activeCloneId,
  _btnViewClass,
  _btnDarkModeClass,
  _pressDurationCSSVar,
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
} = classNamesAndId;

export const selectors = {
  GRID_ITEMS: document.querySelectorAll(_gridItemClass),
  GRID_CONTAINER: document.querySelector(_gridContainerClass),
  showHideBtn: document.querySelector(_btnViewClass),
  darkModeToggle: document.querySelector(_btnDarkModeClass),
  activeClonedElementSelector: () => document.querySelector(_activeCloneId)
};

/**
 * @type {CSSStyleDeclaration}
 */
const activeMoveCSSIndex = new classNamesAndId().activeMoveCSSIndex();
export default activeMoveCSSIndex;

/**
 * @description returns the --animation-duration-flip duration from css stylesheet
 * @returns {Number} PRESS_DURATION is in ms
 */
export const PRESS_DURATION = Math.ceil(
  parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      _pressDurationCSSVar
    ),
    10
  )
);

/**
 * @description add opacity to grid-container::after
 * @type {CSSStyleRule} gridAfterSelector
 */
export const gridAfterSelector = [...document.styleSheets[0].cssRules].find(
  (rule) => rule.selectorText === _gridContainerAfterClass
);
