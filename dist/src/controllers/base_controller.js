"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
class BaseController {
    constructor(model) {
        this.model = model;
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getAll");
            try {
                if (req.query.name) {
                    const students = yield this.model.find({ name: req.query.name });
                    res.send(students);
                }
                else {
                    const students = yield this.model.find();
                    res.send(students);
                }
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getById:" + req.body);
            try {
                const student = yield this.model.findById(req.body.id);
                res.send(student);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("postooObj:" + req.body);
            try {
                const obj = yield this.model.create(req.body);
                res.status(201).send(obj);
            }
            catch (err) {
                console.log(err);
                res.status(406).send("fail: " + err.message);
            }
        });
    }
    putById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("putObjectById:" + req.params.id);
            try {
                const obj = yield this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
                if (!obj) {
                    return res.status(404).json({ message: "Object not found" });
                }
                res.status(200).json(obj);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ message: err.message });
            }
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("deleteObjectById:" + req.params.id);
            try {
                const deletedDoc = yield this.model.findByIdAndDelete(req.params.id);
                if (!deletedDoc) {
                    return res.status(404).json({ message: "Document not found" });
                }
                res.status(200).json(deletedDoc);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
}
exports.BaseController = BaseController;
const createController = (model) => {
    return new BaseController(model);
};
exports.default = createController;
//# sourceMappingURL=base_controller.js.map