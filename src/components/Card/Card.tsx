import type { Component, JSX } from "solid-js";
import { CopyButton } from "./CopyButton";
import styles from "./Card.module.scss";
import { isBrowser } from "../../utils/isBrowser";

export type Props = {
  withCopy?: boolean;
  padding?: boolean;
  children: JSX.Element;
};

export const Card: Component<Props> = (props) => {
  return (
    <section
      class={[styles.section!, props.padding && styles.padding!].join(" ")}
    >
      <div class={styles.copy!}>
        {props.withCopy && isBrowser && <CopyButton />}
      </div>
      {props.children}
    </section>
  );
};
