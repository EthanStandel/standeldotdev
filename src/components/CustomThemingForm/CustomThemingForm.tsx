import { createEffect, createSignal } from "solid-js";
import { ColorPicker } from "../ColorPicker";
import { getCustomPalette, updateCustomPalette, setThemeMode, themeMode, basePalette, darkPalette } from "../../utils/theme";
import styles from "./CustomThemingForm.module.scss";
import { color } from "../../utils/color";
import { Button } from "../Button";
import { Card } from "../Card/Card";

export const CustomThemingForm = () => {
  const customTheme = getCustomPalette();
  const [primary, setPrimary] = createSignal(color.hexToRgb(customTheme.primary));
  const [secondary, setSecondary] = createSignal(color.hexToRgb(customTheme.secondary));
  const [bgMain, setBgMain] = createSignal(color.hexToRgb(customTheme.bgMain));
  const [bgCard, setbgCard] = createSignal(color.hexToRgb(customTheme.bgCard));
  const [txtMain, setTxtMain] = createSignal(color.hexToRgb(customTheme.txtMain));
  const [txtHeavy, setTxtHeavy] = createSignal(color.hexToRgb(customTheme.txtHeavy));

  createEffect(() => {
    updateCustomPalette({
      primary: color.rgbToHex(primary()),
      secondary: color.rgbToHex(secondary()),
      bgMain: color.rgbToHex(bgMain()),
      bgCard: color.rgbToHex(bgCard()),
      txtMain: color.rgbToHex(txtMain()),
      txtHeavy: color.rgbToHex(txtHeavy()),
    })
  })

  return (
    <>
      <label class={styles.checkboxLabel!}>
        <input 
          type="checkbox"
          checked={themeMode() === "custom"}
          oninput={e => setThemeMode(
            e.currentTarget.checked ? "custom" : "dark"
          )} />
        <span>Start using a custom theme</span>
      </label>

      {themeMode() === "custom" && (
        <>
        <section class={styles.cards!}>
          <Card padding>
            <h2>Primary color</h2>
            <ColorPicker color={primary()} setColor={setPrimary} />
          </Card>
          <Card padding>
            <h2>Secondary color</h2>
            <ColorPicker color={secondary()} setColor={setSecondary} />
          </Card>
          <Card padding>
            <h2>Main background color</h2>
            <ColorPicker color={bgMain()} setColor={setBgMain} />
          </Card>
          <Card padding>
            <h2>Card background color</h2>
            <ColorPicker color={bgCard()} setColor={setbgCard} />
          </Card>
          <Card padding>
            <h2>Main text color</h2>
            <ColorPicker color={txtMain()} setColor={setTxtMain} />
          </Card>
          <Card padding>
            <h2>Heavy text color</h2>
            <ColorPicker color={txtHeavy()} setColor={setTxtHeavy} />
          </Card>
        </section>
        <Button class={styles.clear!} onClick={() => {
          setPrimary(color.hexToRgb(basePalette.primary));
          setSecondary(color.hexToRgb(basePalette.secondary));
          setBgMain(color.hexToRgb(darkPalette.bgMain));
          setbgCard(color.hexToRgb(darkPalette.bgCard));
          setTxtMain(color.hexToRgb(darkPalette.txtMain));
          setTxtHeavy(color.hexToRgb(darkPalette.txtHeavy));
        }}>Clear custom theme back to base dark</Button>
      </>
    )}
    </>
  );
}