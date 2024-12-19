"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDateThreeYearsLater = exports.generateCardNumber = exports.generateCVV = void 0;
const generateCVV = () => {
    return (Math.floor(Math.random() * 900) + 100).toString();
};
exports.generateCVV = generateCVV;
const generateCardNumber = () => {
    const num = Math.floor(Math.random() * 900000000000) + 100000000000;
    return num.toString();
};
exports.generateCardNumber = generateCardNumber;
const generateDateThreeYearsLater = () => {
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() + 3);
    return currentDate;
};
exports.generateDateThreeYearsLater = generateDateThreeYearsLater;
