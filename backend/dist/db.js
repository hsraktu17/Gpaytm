"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect('mongodb+srv://utkarsh172002srivastava:pay-1@cluster0.ti9nuof.mongodb.net/user');
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 30
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    firstname: {
        type: String,
        required: false,
        trim: true,
        maxLength: 50
    },
    lastname: {
        type: String,
        required: false,
        trim: true,
        maxLength: 50
    }
});
// Create a model from the schema
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
