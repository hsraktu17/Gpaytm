import { useState } from "react";
import BottomWarning from "../components/BottomWarning";
import Button  from "../components/Button";
import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signin(){

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    return<div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading label={"SignIn"}/>
                <SubHeading label={"Enter your Credentials to access your account"}/>
                <p className="text-sm font-medium text-left py-2">Username</p>
                <input type = "text" placeholder="Username/EmailId" className="w-full px-2 py-1 border rounded border-slate-200" onChange={e =>{
                    setEmail(e.target.value)
                }} />
                <p className="text-sm font-medium text-left py-2">Password</p>
                <input type = "Password" placeholder="Password" className="w-full px-2 py-1 border rounded border-slate-200" onChange={e =>{
                    setPassword(e.target.value)
                }} />
                <div className="pt-4">
                    <Button label={"SignIn"} onClick={async ()=>{
                        const response = await axios.post("http://localhost:3000/api/v1/user/signin",{
                            email,
                            password
                        })
                        const token = response.data.token
                        localStorage.setItem("token",token)
                        navigate('/dashboard')
                    }}/>
                </div>
                <BottomWarning label={"Don't have an account? "}  buttontext={"Sign Up"}  to={'/signup'}  />
            </div>
        </div>
    </div>
}