import { Component, createEffect, createSignal, Setter } from "solid-js";
import { color } from "../../utils/color";
import { Input } from "../Input";
import styles from "./ColorPicker.module.scss";

// TODO : Implement keyboard controls
// TODO : Add aria descriptions to buttons
// TODO : Add active state of transitioned box-shadow to buttons

export const ColorPicker: Component<VisualColorPickerProps> = (props) => {
  const [error, setError] = createSignal(false);

  createEffect(() => {
    props.color;
    setError(false);
  })

  return (
    <>
      <VisualColorPicker color={props.color} setColor={props.setColor} />
      <Input
        label="Hex value"
        error={error()}
        class={styles.onCard!}
        value={color.rgbToHex(props.color)}
        oninput={e => {
          const { value } = e.currentTarget;
          if (value.length !== 7) {
            setError(true)
            return;
          }
          const { r, g, b } = color.hexToRgb(value);
          if (
            typeof r === "number" 
            && typeof g === "number"
            && typeof b === "number"
          ) {
            props.setColor({ r, g, b });
            setError(false);
          } else {
            setError(true);
          }
        }} />
    </>
  );
}

type VisualColorPickerProps = {
  color: { r: number, g: number, b: number };
  setColor: Setter<{ r: number, g: number, b: number }>;
};

const VisualColorPicker: Component<VisualColorPickerProps> = (props) => {
  let container: HTMLDivElement | undefined;
  let svPane: HTMLDivElement | undefined;
  let vPane: HTMLDivElement | undefined;
  const [hue, setHue] = createSignal(0);
  const [xOffset, setXOffset] = createSignal(0);
  const [yOffset, setYOffset] = createSignal(0);
  const [latestRgb, setLatestRgb] = createSignal(
    { r: -1, g: -1, b: -1 }
  );

  createEffect(() => {
    const { r, g, b } = latestRgb();
    if (r === props.color.r && g === props.color.g && b === props.color.b) {
      return;
    }
    const { h, s, v } = color.rgbToHsv(
      props.color.r, props.color.g, props.color.b
    );
    
    setHue(h);
    setXOffset(s / 100 * svPane!.clientWidth);
    setYOffset(v / 100 * svPane!.clientHeight);
  });

  createEffect(() => {
    const x = xOffset(), y = yOffset();
    const rgb = color.hsvToRgb(
      hue(),
      x / svPane!.clientWidth * 100,
      100 - y / svPane!.clientHeight * 100
    );
    setLatestRgb(rgb);
    props.setColor(rgb);
  });

  const dragEvent = (event: PointerEvent) => {
    if (event.target === vPane) {
      setXOffset(event.offsetX);
      setYOffset(event.offsetY);
    }
    const initialXOffset = event.clientX - xOffset();
    const initialYOffset = event.clientY - yOffset();
    const handlePointerMove = (event: MouseEvent) => {
      const xOffset = event.clientX - initialXOffset;
      const yOffset = event.clientY - initialYOffset;
      if (xOffset < 0) {
        setXOffset(0);
      } else if (xOffset > svPane!.clientWidth) {
        setXOffset(svPane!.clientWidth);
      } else {
        setXOffset(xOffset);
      }

      if (yOffset < 0) {
        setYOffset(0);
      } else if (yOffset > svPane!.clientHeight) {
        setYOffset(svPane!.clientHeight);
      } else {
        setYOffset(yOffset);
      }
    }
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", () => {
      window.removeEventListener("pointermove", handlePointerMove);
    }, { once: true });
  }

  return (
    <div ref={container!} class={styles.container!}>
      <div ref={svPane!} class={styles.svPane!}>
        <div style={{
          background: `linear-gradient(to right, white, ${color.hueToRgbCss(hue())}`,
        }} />
        <div ref={vPane!} class={styles.vPane!} onpointerdown={dragEvent} />
      </div>
      <button
        onpointerdown={dragEvent}
        class={[styles.selector, styles.svSelector].join(" ")}
        style={{
          transform: `translate(${xOffset()}px, ${yOffset()}px)`,
          background: color.hsvToRgbCss(
            hue(),
            xOffset() / (svPane?.clientWidth ?? 0) * 100,
            ((svPane?.clientHeight ?? 0) - yOffset()) / (svPane?.clientHeight ?? 0) * 100
          )
        }} />
      <HueSlider hue={hue()} setHue={setHue} />
    </div>
  );
};

type HueSliderProps = {
  hue: number;
  setHue: (hue: number) => void;
};

const HueSlider: Component<HueSliderProps> = (props) => {
  let bar: HTMLDivElement | undefined;
  const hueSliderOffset = () => (bar?.clientWidth ?? 0) / 360 * props.hue;
  const setHueSliderOffset = (xOffset: number) => props.setHue(xOffset / bar!.clientWidth * 360);

  const dragEvent = (event: PointerEvent) => {
    if (event.target === bar) {
      setHueSliderOffset(event.offsetX)
    }
    const initialXOffset = event.clientX - hueSliderOffset();
    const handlePointerMove = (event: MouseEvent) => {
      const xOffset = event.clientX - initialXOffset;
      if (xOffset < 0) {
        setHueSliderOffset(0);
      } else if (xOffset > bar!.clientWidth) {
        setHueSliderOffset(bar!.clientWidth);
      } else {
        setHueSliderOffset(xOffset);
      }
    }
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", () => {
      window.removeEventListener("pointermove", handlePointerMove);
    }, { once: true });
  }
  return (
    <>
      <div class={styles.sliderContainer!}>
      <div ref={bar!} class={styles.hueBar!} onpointerdown={dragEvent} />
      <button
        onpointerdown={dragEvent}
        class={[styles.selector, styles.hueSelector].join(" ")}
        style={{
          transform: `translateX(${hueSliderOffset()}px)`,
          background: color.hueToRgbCss(props.hue),
        }} />
      </div>
    </>
  )
}