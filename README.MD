# `use-eventer`

A custom React hook for adding event listeners to one or multiple elements with flexible options.

## Index

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
    - [Basic Example](#basic-example)
    - [Advanced Showcases](#advanced-showcases)
        - [Single Event and Element](#single-event-and-element)
        - [Multiple Events on a Single Element](#multiple-events-on-a-single-element)
        - [Multiple Elements and Events](#multiple-elements-and-events)
        - [Specific Case](#specific-case)
- [Cleanup Behavior](#cleanup-behavior)
- [Error Handling](#error-handling)
- [API](#api)
    - [HookOptions](#hookoptions)
- [Notes](#notes)

## Features
- Supports single or multiple refs and event types.
- Handles one-to-one (element-to-event) or one-to-many mappings.
- Provides options for immediate handler execution and event listener configurations.
- Automatically cleans up listeners on unmount or dependency change.


## Installation
This is a standalone hook. You can simply copy and use it from this <a href="https://gist.github.com/mmedoo/bdbacf5c8f275c5fac0f037d814a391e" rel="noopener noreferrer" target="_blank">gist</a> in your React project.

**Or** you can install it using `npm`:
```ps
npm i use-eventer
```


## Usage

- It's simply a `useEffect` that runs your code with dependencies passed.

- You can directly include all the logic you would typically use inside a `useEffect` hook, but instead, return the event handler function.

- No need for cleanup code.

### Basic Example
```jsx
import { useRef } from "react";
import useEventer from "./useEventer";

const MyComponent = () => {
    const buttonRef = useRef(null);

    useEventer(buttonRef, "click", () => () => {
        console.log("Button clicked!");
    }, []);

    return <button ref={buttonRef}>Click Me</button>;
};
```

## Advanced Showcases

This hook shines when handling multiple elements, multiple events, or both, all with a shared event handler.

Also, It saves alot of cleanup code.

### Single Event and Element
Here, it simply saved the cleanup code.
```jsx
const divRef = useRef(null);

useEventer(divRef, "click", () => (event) => {
    console.log(`Event triggered: ${event?.type}`);
}, []);
```

### Multiple Events on a Single Element
```jsx
const divRef = useRef(null);

useEventer(divRef, ["mouseenter", "mouseleave"], () => (event) => {
    console.log(`Event triggered: ${event?.type}`);
}, []);
```

<!-- ### Multiple Elements, One-to-One Mapping -->
### Multiple Elements and Events

#### Before using `useEventer`, you might handle multiple elements and events like this:

```jsx
const divRef1 = useRef(null);
const divRef2 = useRef(null);

useEffect(() => {
    const eventHandler = () => console.log("Event triggered!");

    const controller = new AbortController();
    
    const element1 = divRef1.current;
    const element2 = divRef2.current;

    element1?.addEventListener("click", eventHandler, controller);
    element1?.addEventListener("mouseenter", eventHandler, controller);

    element2?.addEventListener("click", eventHandler, controller);
    element2?.addEventListener("mouseenter", eventHandler, controller);

    return () => {
        controller.abort();
    };
}, []);
```

#### With `useEventer`, this can be simplified:

```jsx
const divRef1 = useRef(null);
const divRef2 = useRef(null);

useEventer([divRef1, divRef2], ["click", "mouseenter"], () => () => {
    console.log("Event triggered!");
}, []);
```

By default, `oneToOne` is set to `false`, meaning each `div` will have both event listeners attached. If `oneToOne` is set to `true`, each `div` will only have the event listener corresponding to its order.


### Specific Case
Sometimes, you may need to add some logic (and maybe with dependencies) before event attachment. You can add it in the callback passed, and then return the event handler.

#### Before Using `useEventer`
```jsx
const divRef = useRef(null);

useEffect(() => {
    console.log("color changed");

    const eventHandler = (event) => {
        console.log(`color is: ${color}`);
    };

    const element = divRef.current;
    element?.addEventListener("click", eventHandler);

    return () => {
        element?.removeEventListener("click", eventHandler);
    };
}, [color]);
```

#### With `useEventer`
```jsx
const divRef = useRef(null);

useEventer(divRef, "click", () => {
    console.log("color changed");

    return (event) => {
        console.log(`color is: ${color}`);
    };
}, [color]);
```

#### Here, Both work exactly the same.

`useEventer` is simply a `useEffect`, but you can add your event listeners with shared dependencies to save lines of code. 

## Cleanup Behavior
- The hook automatically removes event listeners when the component unmounts.
- If `dependencies` change, listeners are re-registered accordingly.
- The `AbortController` is used for efficient cleanup.
- You can pass a `signal` to the event listener for your custom use, but in this case, cleanup function will not use the `AbortController`. Instead, it will manually remove all listeners.

## Error Handling
Throws an error if `oneToOne` is `true` but the number of refs and events don't match.

## API

### `useEventer(ref, event, callback, dependencies?, options?)`

| Parameter       | Type                                             | Description |
| -------------- | ----------------------------------------------- | ----------- |
| `ref`         | `RefObject<T> \| RefObject<T>[]`                 | A single or array of refs pointing to elements. |
| `event`       | `string \| string[]`                             | The event type(s) to listen for. |
| `callback`    | `() => EventListenerCallback`                   | A function returning the event handler. |
| `dependencies` | `any[]` _(optional, default: `[]`)_             | Dependencies for `useEffect`. |
| `options`     | `HookOptions` _(optional, default: `{}`)_        | Additional configuration options. |

## HookOptions

| Option             | Type                      | Default | Description |
| ------------------ | ----------------------- | ------- | ----------- |
| `oneToOne`        | `boolean`                 | `false` | If `true`, each event applies to a single corresponding element. Otherwise, all events apply to all elements. |
| `callHandlerOnce` | `boolean`                 | `false` | If `true`, the handler is called once immediately after setup. |
| `callHandlerOnEach` | `boolean`               | `false` | If `true`, the handler is called on each event binding. |
| `listenerOptions` | `AddEventListenerOptions` | `{}`    | Additional options for the event listener. |

## Notes
- The callback must return an event listener function.
- The `listenerOptions` allow passing options like `passive`, `capture`, or `once`.

This hook provides a simple and flexible way to manage event listeners in React. 🚀
