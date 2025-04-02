import { useEffect } from "react";

/**
 * A custom React hook to add event listeners to one or multiple elements.
 *
 * @param {React.RefObject | React.RefObject[]} ref
 * A single or array of refs pointing to elements.
 * @param {string | string[]} event
 * The event type(s) to listen for.
 * @param {() => (event?: Event) => void} callback
 * A function returning the event handler.
 * @param {any[]} [dependencies=[]]
 * Dependencies for the `useEffect` hook. (default: [])
 * @param {Object} [options={}]
 * Options for the hook.
 * @param {boolean} [options.oneToOne=false]
 * If `true`, each event is applied to a single corresponding element (one-to-one mapping).
 * @param {boolean} [options.callHandlerOnce=false]
 * Whether the event handler should be called once immediately after setup (default: false).
 * @param {boolean} [options.callHandlerOnEach=false]
 * Whether the handler should be called on each event binding (default: false).
 * @param {Object} [options.listenerOptions={}]
 * Additional options to pass to the event listener (default: {}).
 *
 * @example
 * ```jsx
 * const buttonRef = useRef(null);
 * useListener(buttonRef, "click", () => () => {
 *     console.log("Button clicked!")
 * });
 * ```
 */
export default function useListener(
	ref,
	event,
	callback,
	dependencies = [],
	options = {}
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