"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => useListener
});
module.exports = __toCommonJS(index_exports);
var import_react = require("react");
function useListener(ref, event, callback, dependencies = [], options = {}) {
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
  (0, import_react.useEffect)(() => {
    var _a, _b, _c;
    const handler = callback();
    if (callHandlerOnce) handler();
    const controller = new AbortController();
    if (oneToOne) {
      for (let i = 0; i < refs.length; i++) {
        if (callHandlerOnEach) handler();
        (_b = (_a = refs[i]) == null ? void 0 : _a.current) == null ? void 0 : _b.addEventListener(events[i], handler, __spreadValues({
          signal: controller.signal
        }, listenerOptions));
      }
      return () => controller.abort();
    }
    for (let rf of refs) {
      for (let evt of events) {
        if (callHandlerOnEach) handler();
        (_c = rf == null ? void 0 : rf.current) == null ? void 0 : _c.addEventListener(evt, handler, __spreadValues({
          signal: controller.signal
        }, listenerOptions));
      }
    }
    return () => {
      var _a2, _b2, _c2;
      if (listenerOptions.signal) {
        if (oneToOne) {
          for (let i = 0; i < refs.length; i++) {
            (_b2 = (_a2 = refs[i]) == null ? void 0 : _a2.current) == null ? void 0 : _b2.removeEventListener(events[i], handler);
          }
        } else for (let rf of refs) {
          for (let evt of events) {
            (_c2 = rf == null ? void 0 : rf.current) == null ? void 0 : _c2.removeEventListener(evt, handler);
          }
        }
      } else {
        controller.abort();
      }
    };
  }, dependencies);
}
