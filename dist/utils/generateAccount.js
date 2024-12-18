"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAC = void 0;
const generateAC = () => {
    return ("0000" +
        Math.floor(Math.random() * 9999999999 - 1000000000 + 1) +
        1000000000);
};
exports.generateAC = generateAC;
