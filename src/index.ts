import { useEffect, RefObject } from "react";

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
}

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
export default function useListener<T extends HTMLElement>(
	ref: RefObject<T> | RefObject<T>[],
	event: string | string[],
	callback: () => EventListenerCallback,
	dependencies: any[] = [],
	options: HookOptions = {}
) {
	const {
		oneToOne = false,
		callHandlerOnce = false,
		callHandlerOnEach = false,
		listenerOptions = {}
	} = options;

	const events = Array.isArray(event) ? event : [event];
	const refs = Array.isArray(ref) ? ref : [ref];

	if (oneToOne && refs.length !== events.length) {
		throw new Error(
			"When oneToOne is set to false, the number of refs and events must be equal."
		);
	}

	useEffect(() => {
		const handler = callback();
		if (callHandlerOnce) handler();

		const controller = new AbortController();

		if (oneToOne) {
			for (let i = 0; i < refs.length; i++) {
				if (callHandlerOnEach) handler();
				refs[i]?.current?.addEventListener(events[i], handler, {
					signal: controller.signal,
					...listenerOptions,
				});
			}
			return () => controller.abort();
		}

		for (let rf of refs) {
			for (let evt of events) {
				if (callHandlerOnEach) handler();
				rf?.current?.addEventListener(evt, handler, {
					signal: controller.signal,
					...listenerOptions,
				});
			}
		}

		return () => {
			if (listenerOptions.signal) {
				if (oneToOne) {
					for (let i = 0; i < refs.length; i++) {
						refs[i]?.current?.removeEventListener(events[i], handler);
					}
				}

				else for (let rf of refs) {
					for (let evt of events) {
						rf?.current?.removeEventListener(evt, handler);
					}
				}
			} else {
				controller.abort();
			}
		};
		
	}, dependencies);
}