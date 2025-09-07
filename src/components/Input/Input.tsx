import styles from "./Input.module.scss";
import { type Component, type JSX, splitProps } from "solid-js";

export type InputProps = {
  label?: JSX.Element;
  labelProps?: JSX.InputHTMLAttributes<HTMLLabelElement>;
  error?: boolean;
} & JSX.InputHTMLAttributes<HTMLInputElement>;

export const Input: Component<InputProps> = (props) => {
  const [local, native] = splitProps(props, ["label", "class", "error"]);

  return (
    <label class={[styles.label!, local.error! && styles.error].join(" ")}>
      <input
        {...native}
        class={[
          local.class,
          (!!props.value || !!native.placeholder) && styles.raised,
          styles.input,
        ].join(" ")}
      />
      <span>{local.label}</span>
    </label>
  );
};
