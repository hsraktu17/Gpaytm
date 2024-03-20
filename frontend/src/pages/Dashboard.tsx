import { useEffect, useState } from "react";
import Appbar from "../components/Appbar";
import Balance from "../components/Balance";
import Users from "../components/Users";
import axios from "axios";

export default function Dashboard (){
    const [balance , setBalance] = useState(0)
    const [users, setUsers] = useState("")
    useEffect(()=>{

        const fetchUsername = async () =>{
            try{
                const token = localStorage.getItem('token')
                if(!token){
                    throw new Error('JWT token not found in local storage')
                }

                const response = await axios.get(' http://localhost:3000/api/v1/user/getLogedIN',{
                    headers : {
                        Authorization : `Bearer ${token}`
                    }
                })

                const username = response.data.firstname
                setUsers(username)

            }
            catch(error){
                console.error("Error fetching data", error)
            }
        }
        

        const fetchData = async () =>{
            try{
                const token = localStorage.getItem('token')
                if(!token){
                    throw new Error("JWT token not found in local storage");
                }
                const response = await axios.get(' http://localhost:3000/api/v1/account/balance',{
                    headers : {
                        Authorization : `Bearer ${token}`
                    }
                })

                const balanceValue = response.data.balance

                setBalance(balanceValue)
            }
            catch(error){
                console.error("Error fetching data", error)
            }
        }
        fetchData()
        fetchUsername()
    },[])
    

    return <div>
        <Appbar/>
        <div className="m-8">
            <h2 className="font-bold text-3xl">Welcome!! {users}</h2>
            <Balance value = {balance}/>
            <Users />
        </div>
    </div>
}