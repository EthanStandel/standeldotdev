import { createEffect, createSignal } from "solid-js";
import { isServer } from "./isBrowser";
import merge from "lodash/merge";

type ThemeMode = "light" | "dark" | "custom";

const themeModeStorageKey = "THEME_MODE_KEY";
const customThemeStorageKey = "CUSTOM_THEME_KEY";

let _darkQuery: MediaQueryList | undefined;
const darkQuery = () => {
  if (!_darkQuery) {
    _darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    let latestState = _darkQuery.matches;
    _darkQuery.addEventListener("change", () => {
      if (_darkQuery!.matches !== latestState) {
        latestState = _darkQuery!.matches;
        setThemeMode(
          darkQuery().matches 
            ? "dark"
            : "light"
        );
      }
    })
  }
  return _darkQuery;
}
const preferredTheme = () => darkQuery().matches 
  ? "dark"
  : "light";

const getThemeModeFromStorageOrPreference = (): ThemeMode | undefined => {
  if (isServer) {
    return undefined;
  }
  const storedTheme = localStorage.getItem(themeModeStorageKey);
  if (storedTheme === "dark" || storedTheme === "light") {
    if (storedTheme !== preferredTheme()) {
      document.documentElement.style.colorScheme = storedTheme;
    } else {
      localStorage.removeItem(themeModeStorageKey);
    }
    return storedTheme;
  } else if (storedTheme === "custom") {
    return storedTheme;
  } else {
    return preferredTheme();
  }
}

const [themeMode, _setThemeMode] = createSignal<ThemeMode | undefined>(
  getThemeModeFromStorageOrPreference()
);

const setThemeMode = (theme: ThemeMode) => {
  if (theme === preferredTheme()) {
    localStorage.removeItem(themeModeStorageKey);
    document.documentElement.style.colorScheme = "";
  } else {
    localStorage.setItem(themeModeStorageKey, theme);
    document.documentElement.style.colorScheme = theme;
  }
  _setThemeMode(theme);
}

const isDark = () => themeMode() === "dark";

const ifDark = <T> (then: T, otherwise: T): T =>
  isDark() ? then : otherwise;

const toggleTheme = () => setThemeMode(ifDark("light", "dark"));

const basePalette = {
  primary: "#ff00aa",
  secondary: "#0080ff"
};

const darkPalette = {
  bgMain: "#20201c",
  bgCard: "#000000",
  txtMain: "#dddddd",
  txtHeavy: "#ffffff",
  txtDim: "#999999",
}

const lightPalette: typeof darkPalette = {
  bgMain: "#f8f8ff",
  bgCard: "#ffffff",
  txtMain: "#222222",
  txtHeavy: "#000000",
  txtDim: "#666666"
};

type FullPalette = typeof darkPalette & typeof basePalette;

const setCustomPaletteVariables = (customTheme?: FullPalette) => {
  if (themeMode() === "custom" && customTheme) {
    document.documentElement.style.setProperty("--palette-primary", customTheme.primary);
    document.documentElement.style.setProperty("--palette-secondary", customTheme.secondary);
    document.documentElement.style.setProperty("--palette-bgMain", customTheme.bgMain);
    document.documentElement.style.setProperty("--palette-bgCard", customTheme.bgCard);
    document.documentElement.style.setProperty("--palette-txtMain", customTheme.txtMain);
    document.documentElement.style.setProperty("--palette-txtHeavy", customTheme.txtHeavy);
    document.documentElement.style.setProperty("--palette-txtDim", customTheme.txtDim);
  } else {
    document.documentElement.style.removeProperty("--palette-primary");
    document.documentElement.style.removeProperty("--palette-secondary");
    document.documentElement.style.removeProperty("--palette-bgMain");
    document.documentElement.style.removeProperty("--palette-bgCard");
    document.documentElement.style.removeProperty("--palette-txtMain");
    document.documentElement.style.removeProperty("--palette-txtHeavy");
    document.documentElement.style.removeProperty("--palette-txtDim");
  }
}

const validateHashColor = (color = ""): boolean => {
  if (color.length !== 7) {
    return false;
  } 
  if (color.charAt(0) !== "#") {
    return false;
  }
  const value = parseInt(color.slice(1), 16);
  return value <= 0xffffff && value >= 0;
}

const validateTheme = (palette: Partial<FullPalette> = {}): boolean => (
  validateHashColor(palette.primary)
  && validateHashColor(palette.secondary)
  && validateHashColor(palette.bgMain)
  && validateHashColor(palette.bgCard)
  && validateHashColor(palette.txtHeavy)
  && validateHashColor(palette.txtMain)
  && validateHashColor(palette.txtDim)
);

const getCustomPalette = () => {
  const storedThemeString = localStorage.getItem(customThemeStorageKey);
  const storedTheme = JSON.parse(storedThemeString || "{}");
  const storedThemeValid = validateTheme(storedTheme);
  if (!storedThemeValid) {
    console.error("Invalid stored theme");
  }
  const customTheme = (
    storedThemeValid
      ? storedTheme
      : { ...darkPalette, ...basePalette }
  ) as FullPalette;
  setCustomPaletteVariables(customTheme);
  return customTheme;
}

const updateCustomPalette = (newCustomPalette?: FullPalette) => {
  if (newCustomPalette) {
    localStorage.setItem(customThemeStorageKey, JSON.stringify(newCustomPalette));
    setCustomPaletteVariables(newCustomPalette);
  } else {
    localStorage.removeItem(customThemeStorageKey);
    setCustomPaletteVariables()
  }
}

const getPalette = () => merge({}, ifDark(lightPalette, darkPalette), basePalette);

createEffect(() => {
  document.documentElement.classList.remove("light-themeMode", "dark-themeMode", "custom-themeMode");
  if (preferredTheme() !== themeMode()) {
    document.documentElement.classList.add(`${themeMode()}-themeMode`);
  }
  if (themeMode() === "custom") {
    updateCustomPalette(getCustomPalette());
  } else {
    setCustomPaletteVariables()
  }
});

export {
  themeMode,
  ifDark,
  toggleTheme,
  getPalette,
  darkPalette,
  lightPalette,
  basePalette,
  setThemeMode,
  getCustomPalette,
  updateCustomPalette
};