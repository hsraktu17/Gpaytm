import express, { Request, Response } from 'express'
import z from 'zod'
import { User, Account } from '../db'
import jwt from 'jsonwebtoken'
import JWT_SECRET from './config'
import authMiddleware from '../middleware'

const router = express.Router()

const signupSchema = z.object({
    username : z.string().email(),
    password : z.string().min(3),
    firstname : z.string(),
    lastname : z.string(),
    
})

router.post('/signup',async (req : Request,res : Response)=>{

    //acquiring the body
    // const body = req.body;

    //instance variable for zod validation
    const validationResult = signupSchema.safeParse(req.body)
    if( !validationResult.success ){
        return res.json({
            message : "Email already taken/ Incorrect input"
        })
    }


    //checking that the user exist in the db or not
    const exsistingUser = await User.findOne({
        username : req.body.username
    })

    if(exsistingUser){
        return res.status(411).json({
            message : "user is already taken"
        })
    }


    //creating the new user and updating in the db
    const user = await User.create({
        username : req.body.username,
        password : req.body.password,
        firstname : req.body.firstname,
        lastname : req.body.lastname
    })

    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })



    //jwt verification
    const token = jwt.sign({
        userId
    },JWT_SECRET)


    //all the process is completed then successful msg and jwt token send off
    res.json({
        message : "User created successfully",
        token : token
    })
})

const signinSchema = z.object({
    username : z.string().email(),
    password : z.string()
})

router.post('/signin',async(req : Request, res : Response) =>{
    const body = req.body;

    const validation = signinSchema.safeParse(body)
    if(!validation.success){
        return res.json({
            message : "wrong input/invalid input"
        })
    }

    const user = await User.findOne({
        username : req.body.username,
        password : req.body.password
    })

    if(user){
        const token = jwt.sign({
            userId : user._id
        },JWT_SECRET)
        res.json({
            token : token
        })
        return
    }

    res.status(411).json({
        message : "Error while logging in"
    })
})


const updateBody = z.object({
    password : z.string().optional(),
    firstname : z.string().optional(),
    lastname : z.string().optional()
})

router.put('/',authMiddleware,async (req : Request, res : Response)=>{
    const validation = updateBody.safeParse(req.body)
    if(!validation.success){
        res.status(411).json({
            message : "Error while updating information"
        })
    }

    await User.updateOne(req.body ,{
        id : req.userId
    })

    res.json({
        message : "Update Successfully"
    })
})


interface Users{
    username : string,
    firstname : string,
    lastname : string,
    _id : string
}


router.get("/bulk",async (req, res) => {
    const filter = req.query.filter || "";
    try {
        // Ensure the filter is not empty to avoid matching all documents
        if (filter) {
            const users = await User.find({
                $or: [
                    { firstname: { $regex: filter, $options: "i" } },
                    { lastname: { $regex: filter, $options: "i" } }
                ]
            });
            res.status(200).json({
                user: users.map((user) => ({
                    username: user.username,
                    firstName: user.firstname,
                    lastName: user.lastname,
                    _id: user._id
                })),
            });
        } else {
            // If no filter is provided, return all users
            const users = await User.find({});
            res.status(200).json({
                user: users.map((user) => ({
                    username: user.username,
                    firstName: user.firstname,
                    lastName: user.lastname,
                    _id: user._id
                })),
            });
        }
    } catch (e) {
        console.error(e); // Log the error for debugging purposes
        res.status(500).send("An error occurred while fetching users.");
    }
});

export default router