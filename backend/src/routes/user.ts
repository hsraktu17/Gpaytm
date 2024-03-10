import express, { Request, Response } from 'express'
import z from 'zod'
import { User } from '../db'
import jwt from 'jsonwebtoken'
import JWT_SECRET from './config'

const router = express.Router()

const signupSchema = z.object({
    username : z.string().email(),
    password : z.string(),
    firstname : z.string(),
    lastname : z.string()
})

router.post('/signup',async (req : Request,res : Response)=>{

    //acquiring the body
    const body = req.body;

    //instance variable for zod validation
    const validationResult = signupSchema.safeParse(body)
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
        firstname : req.body.firstName,
        lastname : req.body.lastName
    })

    const userId = user._id;


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

export default router