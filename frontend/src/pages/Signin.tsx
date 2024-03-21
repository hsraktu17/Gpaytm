import { useState } from "react";
import BottomWarning from "../components/BottomWarning";
import Button  from "../components/Button";
import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signin(){

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [validUser, setValidUser] = useState(true)
    const navigate = useNavigate()

    const handleSignIn = async () => {
        try {
            const response = await axios.post("https://gpaytm-1.onrender.com/api/v1/user/signin",{
                username: username,
                password: password
            })
            const token = response.data.token
            if(token && password.length >= 6){
                localStorage.setItem("token", response.data.token)
                console.log(token)
                navigate('/dashboard')
                setValidUser(true)
            }else{
                setValidUser(false)
            }
            
        } catch (error) {
            console.error("error found" + error)
        }
    }

    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"SignIn"}/>
                    <SubHeading label={"Enter your Credentials to access your account"}/>
                    <p className="text-sm font-medium text-left py-2">Username</p>
                    <input type="text" placeholder="Username/EmailId" className="w-full px-2 py-1 border rounded border-slate-200" onChange={e => setUsername(e.target.value)} />
                    <p className="text-sm font-medium text-left py-2">Password</p>
                    <input type="password" placeholder="Password" className="w-full px-2 py-1 border rounded border-slate-200" onChange={e => setPassword(e.target.value)} />
                    {!validUser && <p className="text-red-500 py-2">Invalid email or password</p>}
                    <div className="pt-4">
                        <Button label={"SignIn"} onClick={handleSignIn} />
                    </div>
                    <BottomWarning label={"Don't have an account? "}  buttontext={"Sign Up"}  to={'/signup'}  />
                </div>
            </div>
        </div>
    );
}
