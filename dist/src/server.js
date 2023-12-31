"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
(0, app_1.default)().then((app) => {
    const port = process.env.PORT;
    app.listen(port, () => {
        console.log(`Example app listening at http://0.0.0.0:${port}`);
    });
});
//# sourceMappingURL=server.js.map