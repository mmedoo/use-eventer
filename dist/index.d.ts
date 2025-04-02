import { RefObject } from 'react';

type HookOptions = {
    /**
     * If `true`, each event is applied to a single corresponding element (one-to-one mapping).
     * If `false` (default), all events are applied to all referenced elements.
    */
    oneToOne?: boolean;
    /** Whether the event handler should be called once immediately after setup (default: false). */
    callHandlerOnce?: boolean;
    /** Whether the handler should be called on each event binding (default: false). */
    callHandlerOnEach?: boolean;
    /** Additional options to pass to the event listener (default: {}). */
    listenerOptions?: AddEventListenerOptions;
};
type EventListenerCallback = (event?: Event) => void;
/**
 * A custom React hook to add event listeners to one or multiple elements.
 *
 * @template T
 * The type of the HTML element to which the event listener is attached.
 * @param {RefObject<T> | RefObject<T>[]} ref
 * A single or array of refs pointing to elements.
 * @param {string | string[]} event
 * The event type(s) to listen for.
 * @param {() => EventListenerCallback} callback
 * A function returning the event handler.
 * @param {any[]} [dependencies=[]]
 * Dependencies for the `useEffect` hook. (default: [])
 * @param {HookOptions} [options={}]
 * Options for the hook.
 *
 * @example
 * ```jsx
 * const buttonRef = useRef(null);
 * useListener(buttonRef, "click", () => () => {
 * 		console.log("Button clicked!")
 * });
 * ```
 */
declare function useListener<T extends HTMLElement>(ref: RefObject<T> | RefObject<T>[], event: string | string[], callback: () => EventListenerCallback, dependencies?: any[], options?: HookOptions): void;

export { useListener as default };
