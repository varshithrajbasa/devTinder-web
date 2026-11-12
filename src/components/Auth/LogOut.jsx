import React, { useEffect } from "react";
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

    return <div>Logout Successfull</div>;
};

export default LogOut;
