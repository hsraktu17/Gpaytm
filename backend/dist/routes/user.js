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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = __importDefault(require("zod"));
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("./config"));
const middleware_1 = __importDefault(require("../middleware"));
const router = express_1.default.Router();
const signupSchema = zod_1.default.object({
    username: zod_1.default.string().email(),
    password: zod_1.default.string(),
    firstname: zod_1.default.string(),
    lastname: zod_1.default.string()
});
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //acquiring the body
    const body = req.body;
    //instance variable for zod validation
    const validationResult = signupSchema.safeParse(body);
    if (!validationResult.success) {
        return res.json({
            message: "Email already taken/ Incorrect input"
        });
    }
    //checking that the user exist in the db or not
    const exsistingUser = yield db_1.User.findOne({
        username: req.body.username
    });
    if (exsistingUser) {
        return res.status(411).json({
            message: "user is already taken"
        });
    }
    //creating the new user and updating in the db
    const user = yield db_1.User.create({
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstName,
        lastname: req.body.lastName
    });
    const userId = user._id;
    yield db_1.Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    });
    //jwt verification
    const token = jsonwebtoken_1.default.sign({
        userId
    }, config_1.default);
    //all the process is completed then successful msg and jwt token send off
    res.json({
        message: "User created successfully",
        token: token
    });
}));
const signinSchema = zod_1.default.object({
    username: zod_1.default.string().email(),
    password: zod_1.default.string()
});
router.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const validation = signinSchema.safeParse(body);
    if (!validation.success) {
        return res.json({
            message: "wrong input/invalid input"
        });
    }
    const user = yield db_1.User.findOne({
        username: req.body.username,
        password: req.body.password
    });
    if (user) {
        const token = jsonwebtoken_1.default.sign({
            userId: user._id
        }, config_1.default);
        res.json({
            token: token
        });
        return;
    }
    res.status(411).json({
        message: "Error while logging in"
    });
}));
const updateBody = zod_1.default.object({
    password: zod_1.default.string().optional(),
    firstname: zod_1.default.string().optional(),
    lastname: zod_1.default.string().optional()
});
router.put('/', middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = updateBody.safeParse(req.body);
    if (!validation.success) {
        res.status(411).json({
            message: "Error while updating information"
        });
    }
    yield db_1.User.updateOne(req.body, {
        id: req.userId
    });
    res.json({
        message: "Update Successfully"
    });
}));
router.get('/bulk', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query.filter || "";
    const users = yield db_1.User.find({
        $or: [{
                firstname: {
                    "$regex": filter
                }
            }, {
                lastname: {
                    "$regex": filter
                }
            }]
    });
    res.json({
        user: users.map(user => ({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id
        }))
    });
}));
exports.default = router;
