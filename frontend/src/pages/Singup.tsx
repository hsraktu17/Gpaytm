import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import Button from "../components/Button";
import BottomWarning from "../components/BottomWarning";
import axios from "axios";


export default function Signup() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

  
    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign up"} />
                    <SubHeading label={"Enter your information to create an account"} />
                    <p className="text-sm font-medium text-left py-2">Firstname</p>
                    <input type="text" placeholder="Firstname" className="w-full px-2 py-1 border rounded border-slate-200" onChange={e =>{
                        setFirstName(e.target.value)
                    }} />
                    <p className="text-sm font-medium text-left py-2">Lastname</p>
                    <input type="text" placeholder="Lastname" className="w-full px-2 py-1 border rounded border-slate-200" onChange={e =>{
                        setLastName(e.target.value)
                    }} />
                    <p className="text-sm font-medium text-left py-2">Email</p>
                    <input type="text" placeholder="Email" className="w-full px-2 py-1 border rounded border-slate-200" onChange={e =>{
                        setUsername(e.target.value)
                    }} />
                    <p className="text-sm font-medium text-left py-2">Password</p>
                    <input type="password" placeholder="Password" className="w-full px-2 py-1 border rounded border-slate-200" onChange={e =>{
                        setPassword(e.target.value)
                    }} />
                    <div className="pt-4">
                        <Button label={"SignUp"} onClick={async ()=>{
                            const response = axios.post('http://localhost:3000/api/v1/user/signup',{
                                username,
                                firstName,
                                lastName,
                                password
                            })
                            localStorage.setItem("token",(await response).data.token)
                            navigate('/dashboard')
                        }}/>
                    </div>
                    <BottomWarning label={"Already have an account? "}  buttontext={" Sign In"}  to={'/signin'}  />
                </div>
            </div>
        </div>
    );
}
