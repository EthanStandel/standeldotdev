import {
  type Component,
  createSignal,
  type JSX,
  Show,
  untrack,
} from "solid-js";

/**
 * This component must wrap any Solid astro-island
 * that relies on any global state and is in the <main />
 * element (and is thus swapped on page transitions).
 *
 * The necessity is derived from a bug due to the
 * relationship between astro, solid-js, and @hotwired/turbo.
 *
 * When Turbo changes the page, it just throws away the old DOM.
 * But it does nothing to tell any astro-islands that they must
 * unmount.
 *
 * This means that we're left with a lot of orphan components
 * and zombie effects. This isn't a huge deal because all of
 * these pages are very lightweight. However, if a Solid effect
 * is listening to a global state that gets modified, then it
 * can end up making a recursive effect loop. This is just a
 * quick way of solving this problem, but the alternative
 * preferred solutions would be:
 *
 * 1. Find a way to make Turbo _only_ render the cache,
 *      seeing as this is a static site
 * 2. Find a way to tell astro-islands to unmount by force
 * 3. Find a way to make Solid unmount its root by force
 * 4. Make islands declare their own copy of "global" state
 *      using localStorage as the source of truth between them
 * 5. Consider switching to a less disjointed software model
 *      like Next, Remix, or solid-start which use a full
 *      hydration model
 */
export const ClientRenderGuard: Component<{ children: JSX.Element }> = (
  props
) => {
  const [render, setRender] = createSignal(true);

  document.addEventListener("turbo:render", () => {
    if (untrack(render)) setRender(false);
  });

  return <Show when={render()}>{props.children}</Show>;
};
