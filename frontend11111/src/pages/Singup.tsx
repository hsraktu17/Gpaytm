import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import Button from "../components/Button";
import BottomWarning from "../components/BottomWarning";

interface SignUpData {
    firstname: string;
    lastname: string;
    username: string;
    password: string;
}

const Signup: React.FC = () => {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); 
    const navigate = useNavigate();

    const handleSignUp = async () => {
        try {
            const requestData: SignUpData = {
                firstname,
                lastname,
                username,
                password
            };

            const response = await axios.post<{ token: string }>('http://localhost:3000/api/v1/user/signup', requestData);

            localStorage.setItem("token","Bearer" + response.data.token);
            navigate('/dashboard');
        } catch(error) {
            console.error("Signup error:", error);
            if ((error as AxiosError).response?.status === 400) {
                setErrorMessage("Username already exists or invalid. Please choose a different username.");
            } else {
                setErrorMessage("Failed to sign up. Please try again later.");
            }
        }
    };
  
    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign up"} />
                    <SubHeading label={"Enter your information to create an account"} />
                    <p className="text-sm font-medium text-left py-2">Firstname</p>
                    <input type="text" placeholder="Firstname" className="w-full px-2 py-1 border rounded border-slate-200" onChange={e => setFirstname(e.target.value)} />
                    <p className="text-sm font-medium text-left py-2">Lastname</p>
                    <input type="text" placeholder="Lastname" className="w-full px-2 py-1 border rounded border-slate-200" onChange={e => setLastname(e.target.value)} />
                    <p className="text-sm font-medium text-left py-2">Email</p>
                    <input type="text" placeholder="Email" className="w-full px-2 py-1 border rounded border-slate-200" onChange={e => setUsername(e.target.value)} />
                    <p className="text-sm font-medium text-left py-2">Password</p>
                    <input type="password" placeholder="Password" className="w-full px-2 py-1 border rounded border-slate-200" onChange={e => setPassword(e.target.value)} />
                    {errorMessage && <p className="text-red-500 py-2">{errorMessage}</p>}
                    <div className="pt-4">
                        <Button label={"SignUp"} onClick={handleSignUp} />
                    </div>
                    <BottomWarning label={"Already have an account? "} buttontext={" Sign In"} to={'/signin'} />
                </div>
            </div>
        </div>
    );
}

export default Signup;