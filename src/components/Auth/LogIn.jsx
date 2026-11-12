import { useState } from "react";
import axios from "../../api/apiClient";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { addUser } from "../../utils/userSlice";
import { emailValidator, passwordValidator } from "../../utils/validators";

const LogIn = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({
        emailId: "",
        password: "",
        api: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailChange = (e) => {
        setEmailId(e.target.value);
        if (errors.emailId || errors.api) {
            setErrors((prev) => ({ ...prev, emailId: "", api: "" }));
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (errors.password || errors.api) {
            setErrors((prev) => ({ ...prev, password: "", api: "" }));
        }
    };

    const handleEmailBlur = () => {
        if (emailId.trim()) {
            const isEmailValid = emailValidator(emailId);
            if (isEmailValid !== true) {
                setErrors((prev) => ({ ...prev, emailId: isEmailValid }));
            }
        }
    };

    const handlePasswordBlur = () => {
        if (password) {
            const isPasswordValid = passwordValidator(password);
            if (isPasswordValid !== true) {
                setErrors((prev) => ({ ...prev, password: isPasswordValid }));
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const emailValidation = emailValidator(emailId);
        const passwordValidation = passwordValidator(password);

        const newErrors = {
            emailId: emailValidation === true ? "" : emailValidation,
            password: passwordValidation === true ? "" : passwordValidation,
            api: "",
        };

        if (newErrors.emailId || newErrors.password) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post("/auth/login", {
                emailId: emailId.trim(),
                password,
            });
            const userData =
                response.data?.user || response.data?.data || response.data;
            dispatch(addUser(userData));
            navigate("/");
        } catch (err) {
            console.error("Login error:", err);
            const apiMessage =
                err.response?.data?.message ||
                (typeof err.response?.data === "string"
                    ? err.response?.data
                    : "") ||
                err.message ||
                "Login failed. Please check your credentials.";
            setErrors((prev) => ({ ...prev, api: apiMessage }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card bg-base-300 w-full max-w-sm shadow-sm mx-auto my-10">
            <div className="card-body">
                <h1 className="card-title justify-center text-2xl font-bold">
                    Login
                </h1>
                <form
                    onSubmit={handleLogin}
                    className="flex flex-col gap-3 mt-2"
                >
                    <div className="flex flex-col">
                        <label
                            className="label label-text font-medium"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={emailId}
                            onChange={handleEmailChange}
                            onBlur={handleEmailBlur}
                            autoComplete="email"
                            className={`input input-bordered w-full ${
                                errors.emailId ? "input-error" : ""
                            }`}
                            placeholder="Email"
                        />
                        {errors.emailId && (
                            <span className="text-error text-xs mt-1">
                                {errors.emailId}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label
                            className="label label-text font-medium"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className={`input input-bordered w-full ${
                                errors.password ? "input-error" : ""
                            }`}
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                            onBlur={handlePasswordBlur}
                            autoComplete="current-password"
                        />
                        {errors.password && (
                            <span className="text-error text-xs mt-1">
                                {errors.password}
                            </span>
                        )}
                    </div>

                    {errors.api && (
                        <div
                            role="alert"
                            className="alert alert-error alert-soft text-sm py-2 justify-center"
                        >
                            <span>{errors.api}</span>
                        </div>
                    )}

                    <button
                        className="btn btn-primary mt-2 w-full"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="loading loading-spinner loading-xs"></span>
                                Logging in...
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>

                    <p className="mt-2 text-center text-sm">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="link link-primary font-medium"
                        >
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LogIn;
