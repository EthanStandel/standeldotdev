import { type Component, createSignal, type JSX, onMount } from "solid-js";
import styles from "./MobileMenu.module.scss";
import Hamburger from "@fortawesome/fontawesome-free/svgs/solid/bars.svg";
import Close from "@fortawesome/fontawesome-free/svgs/solid/xmark.svg";
import { sleep } from "../../../utils/sleep";

type MobileMenuProps = {
  children: JSX.Element;
};

export const MobileMenu: Component<MobileMenuProps> = (props) => {
  let mobileToggle: HTMLInputElement | undefined;
  let mobileMenu: HTMLDivElement | undefined;
  const [exiting, setExiting] = createSignal(false);

  const clickHandler = async (event: MouseEvent) => {
    if (!mobileMenu) return;
    if (!mobileToggle!.checked) {
      setExiting(true);
      event.preventDefault();
      await sleep(0.2);
      mobileToggle!.checked = false;
      setExiting(false);
    }
  };

  onMount(() => {
    document.addEventListener("turbo:click", async () => {
      if (mobileToggle!.checked) {
        setExiting(true);
        await sleep(0.2);
        mobileToggle!.checked = false;
        setExiting(false);
      }
    });
  });

  return (
    <>
      <input
        ref={mobileToggle!}
        onclick={clickHandler}
        class={styles.mobileToggle!}
        style={{
          "--icon-closed": `url("${Hamburger}")`,
          "--icon-open": `url("${Close}")`,
        }}
        type="checkbox"
        aria-label="Mobile menu open"
      />
      <div
        ref={mobileMenu!}
        class={[styles.mobileMenu!, exiting() && styles.exiting].join(" ")}
      >
        {props.children}
      </div>
    </>
  );
};
