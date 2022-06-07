"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMsg = exports.getMsg = exports.saveMsg = void 0;
const tslib_1 = require("tslib");
const msg_1 = tslib_1.__importDefault(require("../models/messages"));
const sequelize_1 = require("sequelize");
const saveMsg = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const message = req.body.message;
        const username = req.user.name;
        const grpId = req.query.id;
        if (!grpId) {
            yield user.createText({ message: message, userName: username });
            return res.status(201).json({ success: true, message: 'Text Saved to DB' });
        }
        else {
            yield user.createText({ message: message, userName: username, GroupGrpId: grpId });
            return res.status(201).json({ success: true, message: 'Text Saved to DB' });
        }
    }
    catch (_a) {
        return res.status(400).json({ success: false, message: 'Database Operation Failed Try Again' });
    }
});
exports.saveMsg = saveMsg;
const getMsg = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const grpId = req.query.id;
        if (!grpId) {
            console.log('-----------------------------Inside Controller-----------------------');
            const texts = yield msg_1.default.findAll({ where: { GroupGrpId: null } });
            res.status(201).json({ success: true, message: 'Chats retrieved from DB', texts: texts });
            return;
        }
        else {
            const texts = yield msg_1.default.findAll({ where: { GroupGrpId: grpId } });
            return res.status(201).json({ success: true, message: 'Group Chats retrieved from DB', texts: texts });
        }
    }
    catch (_b) {
        return res.status(404).json({ success: false, message: 'Chats retrieval from DB Failed' });
    }
});
exports.getMsg = getMsg;
const updateMsg = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const text = yield msg_1.default.findAll({ where: { msgid: { [sequelize_1.Op.gte]: id } } });
        res.status(201).json({ success: true, message: 'Chats retrieved from DB', texts: text });
        return;
        const texts = yield msg_1.default.findAll({ where: { msgid: { [sequelize_1.Op.gte]: id }, GroupGrpId: null } });
        return res.status(201).json({ success: true, message: 'Chats retrieved from DB', texts: texts });
    }
    catch (_c) {
        res.status(404).json({ success: false, message: 'Chats retrieval from DB Failed' });
        return res.status(404).json({ success: false, message: 'Chats retrieval from DB Failed' });
    }
});
exports.updateMsg = updateMsg;
