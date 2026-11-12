import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { removeUser } from "../../utils/userSlice";
import axiosInstance from "../../api/apiClient";

const LogOut = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutUser = async () => {
        await axiosInstance.post("/auth/logout");
        dispatch(removeUser());
        navigate("/login");
    };

    useEffect(() => {
        logoutUser();
    }, []);

    return (
        <div className="card bg-base-300 w-96 shadow-sm mx-auto my-10">
            <div className="card-body items-center text-center">
                <h1 className="card-title">Logout Successfull</h1>
            </div>
        </div>
    );
};

export default LogOut;
