"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fifteenMinutes = exports.sToMs = exports.msToS = void 0;

const msToS = ms => ms * 1000;

exports.msToS = msToS;

const sToMs = s => s / 1000;

exports.sToMs = sToMs;
const fifteenMinutes = 60 * 15;
exports.fifteenMinutes = fifteenMinutes;