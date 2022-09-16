import { Button } from "../Button";
import CopyIcon from "@fortawesome/fontawesome-free/svgs/solid/copy.svg";
import SuccessIcon from "@fortawesome/fontawesome-free/svgs/solid/check.svg";
import { Component, createSignal } from "solid-js";
import { sleep } from "../../utils/sleep";

export const CopyButton: Component = () => {
  const [success, setSuccess] = createSignal(false)

  return (
    <Button icon
      aria-label="Copy"
      style={{ opacity: success() ? 1 : "" }}
      onclick={async (event: MouseEvent) => {
        navigator.clipboard.writeText(
          (event.currentTarget! as any as HTMLElement)
            .parentElement! // astro-island
            .parentElement! // containing div
            .parentElement! // section (the card)
            .textContent!
        )
        setSuccess(true);
        await sleep(1.5);
        setSuccess(false);
      }}>
      <img 
        height="25px"
        width="25px"
        style={{ filter: "var(--icon-filter)" }}
      src={success() ? SuccessIcon : CopyIcon} />
    </Button>
  );
}