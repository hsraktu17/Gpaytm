import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

interface User {
    _id: number;
    username : string;
}

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `http://localhost:3000/api/v1/user/bulk?filter=${filter}`;
                const response = await axios.get(url);
                console.log(response.data)
                setUsers(response.data);
                console.log("users " + users)
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchData();
    }, [filter]);

    return (
        <>
            <div className="font-bold mt-6 text-lg">
                Users
            </div>
            <div className="my-2">
                <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full px-2 py-1 border rounded border-slate-200"
                    onChange={e => setFilter(e.target.value)}
                />
            </div>
            <div>
                {users && users.map(user => <User key={user._id} user={user} />)}
            </div>
        </>
    );
}

function User({ user }: { user: User }) {
    const navigate = useNavigate();
    return (
        <div className="flex justify-between">
            <div className="flex">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {user.username[0]}
                    </div>
                </div>
                <div className="flex flex-col justify-center h-full">
                    <div>
                        {user.username}
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center h-full">
                <button className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2" onClick={()=> navigate(`/send?id=${user._id}&name=${user.username}`)}>
                    Send Money
                </button>
            </div>
        </div>
    );
}
