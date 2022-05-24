"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var db_1 = __importDefault(require("./utils/db"));
var user_1 = require("./routes/user");
var authenticate = __importStar(require("./controllers/auth"));
var msgs_1 = require("./routes/msgs");
var groups_1 = require("./routes/groups");
var users_1 = require("./models/users");
var messages_1 = require("./models/messages");
var groups_2 = require("./models/groups");
var usergroups_1 = require("./models/usergroups");
// Associations
users_1.usertable.hasMany(messages_1.messagetable);
messages_1.messagetable.belongsTo(users_1.usertable);
groups_2.grouptable.belongsToMany(users_1.usertable, { through: usergroups_1.usergroups });
users_1.usertable.belongsToMany(groups_2.grouptable, { through: usergroups_1.usergroups });
groups_2.grouptable.hasMany(messages_1.messagetable);
messages_1.messagetable.belongsTo(groups_2.grouptable);
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(user_1.userrouter);
app.use("*", authenticate.auth);
app.use(msgs_1.msgrouter);
app.use(groups_1.grouprouter);
db_1.default.sync()
    .then(function () { app.listen(3000); })
    .catch(function (err) { return console.log(err); });