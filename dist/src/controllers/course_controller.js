"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const course_model_1 = __importDefault(require("../models/course_model"));
const base_controller_1 = __importDefault(require("./base_controller"));
const course_controller = (0, base_controller_1.default)(course_model_1.default);
exports.default = course_controller;
//# sourceMappingURL=course_controller.js.map