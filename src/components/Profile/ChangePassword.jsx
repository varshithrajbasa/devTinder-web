import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import axios from "../../api/apiClient";
import {
    passwordValidator,
    confirmPasswordValidator,
} from "../../utils/validators";
import Password from "../shared/Password";

const ChangePassword = () => {
    const user = useSelector((store) => store.user);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const [errors, setErrors] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        api: "",
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    if (!user) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="card bg-base-300 w-full max-w-md shadow-xl text-center p-8 border border-base-200">
                    <div className="flex justify-center mb-4 text-warning">
                        <svg
                            className="w-16 h-16"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                    <p className="text-base-content/70 mb-6">
                        You must be logged in to change your password.
                    </p>
                    <Link
                        to="/login"
                        className="btn btn-primary w-full shadow-md"
                    >
                        Login Now
                    </Link>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name] || errors.api) {
            setErrors((prev) => ({ ...prev, [name]: "", api: "" }));
        }
        if (successMessage) {
            setSuccessMessage("");
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let validationResult = true;

        if (name === "currentPassword") {
            if (!value) {
                validationResult = "Current password is required.";
            }
        } else if (name === "newPassword") {
            validationResult = passwordValidator(value);
            if (
                validationResult === true &&
                formData.currentPassword &&
                value === formData.currentPassword
            ) {
                validationResult =
                    "New password must be different from current password.";
            }
            if (formData.confirmNewPassword) {
                const matchResult = confirmPasswordValidator(
                    value,
                    formData.confirmNewPassword,
                );
                setErrors((prev) => ({
                    ...prev,
                    confirmNewPassword: matchResult === true ? "" : matchResult,
                }));
            }
        } else if (name === "confirmNewPassword") {
            validationResult = confirmPasswordValidator(
                formData.newPassword,
                value,
            );
        }

        if (validationResult !== true) {
            setErrors((prev) => ({ ...prev, [name]: validationResult }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let currentPassErr = "";
        if (!formData.currentPassword) {
            currentPassErr = "Current password is required.";
        }

        let newPassErr = passwordValidator(formData.newPassword);
        if (
            newPassErr === true &&
            formData.currentPassword &&
            formData.newPassword === formData.currentPassword
        ) {
            newPassErr =
                "New password must be different from current password.";
        }

        const confirmPassErr = confirmPasswordValidator(
            formData.newPassword,
            formData.confirmNewPassword,
        );

        const newErrors = {
            currentPassword: currentPassErr,
            newPassword: newPassErr === true ? "" : newPassErr,
            confirmNewPassword: confirmPassErr === true ? "" : confirmPassErr,
            api: "",
        };

        const hasErrors = Object.values(newErrors).some((err) => Boolean(err));
        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        setErrors((prev) => ({ ...prev, api: "" }));

        try {
            const payload = {
                currentPassword: formData.currentPassword,
                oldPassword: formData.currentPassword,
                password: formData.currentPassword,
                newPassword: formData.newPassword,
            };

            let response;
            try {
                response = await axios.patch("/profile/password", payload);
            } catch (patchErr) {
                if (
                    patchErr.response?.status === 404 ||
                    patchErr.response?.status === 405
                ) {
                    response = await axios.post("/profile/password", payload);
                } else {
                    throw patchErr;
                }
            }

            const successMsg =
                response?.data?.message ||
                (typeof response?.data === "string" ? response?.data : "") ||
                "Password updated successfully!";

            setSuccessMessage(successMsg);
            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: "",
            });

            setTimeout(() => {
                navigate("/logout");
            }, 1800);
        } catch (err) {
            console.error("Change password error:", err);
            const apiMessage =
                err.response?.data?.message ||
                (typeof err.response?.data === "string"
                    ? err.response?.data
                    : "") ||
                err.message ||
                "Failed to update password. Please check your current password.";
            setErrors((prev) => ({ ...prev, api: apiMessage }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 py-8 w-full">
            <Link
                to="/profile"
                className="btn btn-ghost btn-sm gap-2 mb-4 text-base-content/70 hover:text-base-content"
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
                Back to Profile
            </Link>

            <div className="card bg-base-300 shadow-xl border border-base-200">
                <div className="card-body p-6">
                    <div className="flex flex-col items-center text-center mb-4">
                        <div className="p-3 bg-primary/10 text-primary rounded-full mb-2">
                            <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                        <h1 className="card-title text-2xl font-bold">
                            Change Password
                        </h1>
                        <p className="text-xs text-base-content/60 mt-1">
                            Choose a strong, unique password to protect your Dev
                            Connect account.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4"
                    >
                        <Password
                            required={true}
                            label={"Current Password"}
                            id="currentPassword"
                            value={formData.currentPassword}
                            placeholder="Enter current password"
                            onHandleChange={handleChange}
                            onHandleBlur={handleBlur}
                            error={errors.currentPassword}
                        />
                        <Password
                            required={true}
                            label={"New Password"}
                            id="newPassword"
                            value={formData.newPassword}
                            placeholder="Enter new strong password"
                            onHandleChange={handleChange}
                            onHandleBlur={handleBlur}
                            error={errors.newPassword}
                        />
                        <Password
                            required={true}
                            label={"Confirm New Password"}
                            id="confirmNewPassword"
                            value={formData.confirmNewPassword}
                            placeholder="Re-enter new password"
                            onHandleChange={handleChange}
                            onHandleBlur={handleBlur}
                            error={errors.confirmNewPassword}
                        />

                        {errors.api && (
                            <div
                                role="alert"
                                className="alert alert-error alert-soft text-sm py-2"
                            >
                                <span>{errors.api}</span>
                            </div>
                        )}

                        {successMessage && (
                            <div
                                role="alert"
                                className="alert alert-success alert-soft text-sm py-2"
                            >
                                <span>{successMessage}</span>
                            </div>
                        )}

                        <div className="flex flex-col gap-2 mt-2">
                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="loading loading-spinner loading-xs"></span>
                                        Updating Password...
                                    </>
                                ) : (
                                    "Update Password"
                                )}
                            </button>
                            <Link
                                to="/profile"
                                className="btn btn-ghost btn-sm w-full"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
