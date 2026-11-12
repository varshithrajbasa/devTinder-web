import { useState } from "react";
import axios from "../../api/apiClient";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { addUser } from "../../utils/userSlice";

const LogIn = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/auth/login", {
                emailId,
                password,
            });
            dispatch(addUser(response.data.user));
            navigate("/");
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <div className="card bg-base-300 w-80 shadow-sm mx-auto my-10">
            <h1 className="card-title justify-center mt-4">Login</h1>
            <fieldset className="fieldset p-4">
                <label className="label" htmlFor="email">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    autoComplete="email"
                    className="input"
                    placeholder="Email"
                />
                <label className="label" htmlFor="password">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    className="input"
                    placeholder="Password"
                    minLength={8}
                    maxLength={20}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="btn btn-primary mt-4" onClick={handleLogin}>
                    Login
                </button>
                <p className="mt-4 text-center">
                    Don't have an account?{" "}
                    <a
                        onClick={() => navigate("/signup")}
                        className="link link-primary"
                    >
                        Sign up
                    </a>
                </p>
            </fieldset>
        </div>
    );
};

export default LogIn;
