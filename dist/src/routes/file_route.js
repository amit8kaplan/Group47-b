"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
const user_controller_1 = __importDefault(require("../controllers/user_controller"));
const file_upload_1 = require("../common/file_upload");
// const base = "http://" + process.env.DOMAIN_BASE + ":" + process.env.PORT + "/";
router.post('/', auth_middleware_1.default, file_upload_1.upload.single("file"), user_controller_1.default.postPhotoOfUser.bind(user_controller_1.default));
router.delete('/', auth_middleware_1.default, user_controller_1.default.deletePhotoOfUser.bind(user_controller_1.default));
module.exports = router;
//# sourceMappingURL=file_route.js.map