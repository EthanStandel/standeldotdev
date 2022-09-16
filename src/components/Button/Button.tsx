import styles from "./Button.module.scss";
import { Component, mergeProps, splitProps } from "solid-js";
import type { JSX } from "solid-js/types/jsx";

type BaseButtonProps = {
  on?: "main" | "card",
  icon?: boolean;
  inactive?: boolean;
};

type AnchorButtonProps = BaseButtonProps & JSX.AnchorHTMLAttributes<HTMLAnchorElement>;
type ButtonButtonProps = BaseButtonProps & JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonProps = AnchorButtonProps | ButtonButtonProps;

// This could be an Astro component but it's always
// going to be used within solid islands
export const Button: Component<ButtonProps> = (props) => {
  const [local, native] = splitProps(
    mergeProps({ on: "main", icon: false } as const, props),
    ["children", "class", "on", "inactive", "icon"]
  );

  const baseButtonProps = {
    children: (
      <div class={[
        local.icon && styles.icon,
        local.on === "card" && styles.onCard,
        styles.container
      ].join(" ")}>
        {local.children}
      </div>
    )
  }

  // must be function so that props can update
  const buttonProps = () => ({
    ...native,
    class: [
      local.class,
      styles.button,
      local.on === "card" && styles.onCard,
      local.icon && styles.icon
    ].join(" "),
    ...baseButtonProps
  });

  // using a dynamic selector bombed the server render
  if ("href" in native) {
    return <a {...(buttonProps as () => AnchorButtonProps)()} />
  } else {
    return <button {...(buttonProps as () => ButtonButtonProps)()} />
  }
}