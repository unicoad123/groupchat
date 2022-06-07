"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGrps = exports.createGrp = void 0;
exports.removeUser = exports.getGrps = exports.createGrp = void 0;
const tslib_1 = require("tslib");
const group_1 = tslib_1.__importDefault(require("../models/groups"));
const usersgroup_1 = tslib_1.__importDefault(require("../models/usersgroups"));
const sequelize_1 = require("sequelize");
const createGrp = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const grpName = req.body.groupName;
        const isAdmin = req.body.isAdmin;
        const uId = req.body.uId;
        let existingGrp = yield group_1.default.findOne({ where: { grpName: grpName } });
        if (!existingGrp) {
            yield group_1.default.create({
                grpName: grpName
            });
            existingGrp = yield group_1.default.findOne({ where: { grpName: grpName } });
        }
        const gId = existingGrp.grpId;
        yield usersgroup_1.default.create({
            isAdmin: isAdmin,
            GroupGrpId: gId,
            UserId: uId,
        });
        return res.status(201).json({ success: true, message: 'User Added to group successfully' });
    }
    catch (_a) {
        (e) => {
            console.log(e);
            return res.status(404).json({ success: false, message: 'Adding User to Group Failed, Try Again...' });
        };
    }
});
exports.createGrp = createGrp;
const getGrps = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const uId = req.user.id;
        console.log('-------------------------', uId);
        let memberGrpIds = [];
        const memberGrps = yield usersgroup_1.default.findAll({ where: { UserId: uId } });
        console.log('-------------------------', memberGrps);
        for (let i = 0; i < memberGrps.length; i++) {
            memberGrpIds.push(memberGrps[i].GroupGrpId);
        }
        const memberOf = yield group_1.default.findAll({ where: { grpId: { [sequelize_1.Op.or]: memberGrpIds } } });
        return res.status(201).json({ success: true, message: 'groups for member fetched from db', memberOf });
    }
    catch (_b) {
        return res.status(404).json({ success: true, message: 'error while fetching groups from DB' });
    }
});
exports.getGrps = getGrps;
const removeUser = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const uId = req.body.uId;
    const grpId = req.body.grpId;
    const loggedId = req.user.id;
    try {
        const ug = yield usersgroup_1.default.findOne({ where: { UserId: loggedId, GroupGrpId: grpId } });
        if (ug.isAdmin == true) {
            yield usersgroup_1.default.destroy({ where: { UserId: uId, GroupGrpId: grpId } });
            return res.json({ success: true, message: 'User Deleted Successfully from Chat-Group' });
        }
        return res.json({ success: false, message: 'You dont have admin access for the Chat-Group' });
    }
    catch (_c) {
        return res.status(404).json({ success: false, message: 'database operation failed, try Again ...' });
    }
});
exports.removeUser = removeUser;