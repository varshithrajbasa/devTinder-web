import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import NavBar from "./NavBar";
import Footer from "./Footer";
import axiosInstance from "../../api/apiClient";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../utils/userSlice";

const Body = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const user = useSelector((store) => store.user);

    const fetchProfile = async () => {
        try {
            const response = await axiosInstance.get("/profile/view");
            dispatch(addUser(response.data.user));
        } catch (error) {
            console.error("Error Fetching profile:", error);
        }
    };

    useEffect(() => {
        if (!["/login", "/signup"].includes(location.pathname) && !user)
            fetchProfile();
    }, []);

    return (
        <>
            <NavBar />
            <Outlet />
            <Footer />
        </>
    );
};

export default Body;
