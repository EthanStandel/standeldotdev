import { ifDark, toggleTheme } from "../../utils/theme";
import { Button } from "../Button";
import SunIcon from "@fortawesome/fontawesome-free/svgs/solid/sun.svg";
import MoonIcon from "@fortawesome/fontawesome-free/svgs/solid/moon.svg";

export const ThemeToggle = () => (
  <Button icon onClick={toggleTheme} aria-label="Toggle theme">
    <img
      height="25px"
      width="25px"
      src={ifDark(SunIcon, MoonIcon)}
      style={{
        filter: "var(--icon-filter)"
      }} />
  </Button>
);