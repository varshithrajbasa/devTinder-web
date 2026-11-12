import { useEffect, useState } from "react";
import axios from "../../api/apiClient";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { addUser } from "../../utils/userSlice";

const LogIn = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({ email: "", password: "", api: "" });

    useEffect(() => {
        //check the emailid pattern and password length 8 and max 20 and check on debounce, like once the typing is stopped
    }, [emailId, password]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!emailId.trim()) {
            setError({ ...error, emailId: "Email is required" });
        }
        if (!password.trim()) {
            setError({ ...error, password: "Passwod is required" });
        }
        try {
            const response = await axios.post("/auth/login", {
                emailId,
                password,
            });
            dispatch(addUser(response.data.user));
            navigate("/");
        } catch (error) {
            console.error("Login error:", error);
            setError({ ...error, api: error.response.data.message });
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
                {error.api && (
                    <div role="alert" className="alert alert-error alert-soft">
                        <span>{error.api}</span>
                    </div>
                )}
                <button className="btn btn-primary mt-4" onClick={handleLogin}>
                    Login
                </button>
                <p className="mt-4 text-center">
                    Don't have an account?{" "}
                    <Link to="/signup" className="link link-primary">
                        Sign up
                    </Link>
                </p>
            </fieldset>
        </div>
    );
};

export default LogIn;
