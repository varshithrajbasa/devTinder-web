import { useState } from "react";
import axios from "../../api/apiClient";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../utils/userSlice";
import {
    emailValidator,
    passwordValidator,
    confirmPasswordValidator,
    nameValidator,
    yearOfBirthValidator,
    genderValidator,
    skillsValidator,
} from "../../utils/validators";
import Password from "../shared/Password";
import Input from "../shared/Input";

const SignUp = ({ isEdit = false, user: propUser = null, onSuccess }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const reduxUser = useSelector((store) => store.user);
    const currentUser = propUser || (isEdit ? reduxUser : null);

    const getInitialYear = (usr) => {
        if (!usr) return "";
        if (usr.yearOfBirth) return String(usr.yearOfBirth);
        if (usr.age) return String(new Date().getFullYear() - usr.age);
        return "";
    };

    const [formData, setFormData] = useState(() => ({
        firstName: currentUser?.firstName || "",
        lastName: currentUser?.lastName || "",
        emailId: currentUser?.emailId || "",
        password: "",
        re_password: "",
        yearOfBirth: getInitialYear(currentUser),
        gender: currentUser?.gender || "",
        skills: Array.isArray(currentUser?.skills)
            ? currentUser.skills.join(", ")
            : currentUser?.skills || "",
        photoUrl: currentUser?.photoUrl || "",
        about: currentUser?.about || "",
    }));

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        emailId: "",
        password: "",
        re_password: "",
        yearOfBirth: "",
        gender: "",
        skills: "",
        photoUrl: "",
        about: "",
        api: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    if (isEdit && !currentUser) {
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
                        You need to be logged in to edit your profile.
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
        if (successMsg) {
            setSuccessMsg("");
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let validationResult = true;

        if (name === "firstName") {
            validationResult = nameValidator(value, "First Name");
        } else if (name === "lastName" && value.trim()) {
            validationResult = nameValidator(value, "Last Name");
        } else if (name === "emailId" && !isEdit) {
            validationResult = emailValidator(value);
        } else if (name === "password" && !isEdit) {
            validationResult = passwordValidator(value);
            if (formData.re_password) {
                const matchResult = confirmPasswordValidator(
                    value,
                    formData.re_password,
                );
                setErrors((prev) => ({
                    ...prev,
                    re_password: matchResult === true ? "" : matchResult,
                }));
            }
        } else if (name === "re_password" && !isEdit) {
            validationResult = confirmPasswordValidator(
                formData.password,
                value,
            );
        } else if (name === "yearOfBirth") {
            validationResult = yearOfBirthValidator(value);
        } else if (name === "gender" && value) {
            validationResult = genderValidator(value);
        } else if (name === "skills" && value.trim()) {
            validationResult = skillsValidator(value);
        }

        if (validationResult !== true) {
            setErrors((prev) => ({ ...prev, [name]: validationResult }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fnError = nameValidator(formData.firstName, "First Name");
        const lnError = nameValidator(formData.lastName, "Last Name");
        const yobError = yearOfBirthValidator(formData.yearOfBirth);
        const genderError = genderValidator(formData.gender);
        const skillsError = skillsValidator(formData.skills);

        let emailError = true;
        let passwordError = true;
        let rePasswordError = true;

        if (!isEdit) {
            emailError = emailValidator(formData.emailId);
            passwordError = passwordValidator(formData.password);
            rePasswordError = confirmPasswordValidator(
                formData.password,
                formData.re_password,
            );
        }

        const newErrors = {
            firstName: fnError === true ? "" : fnError,
            lastName: lnError === true ? "" : lnError,
            emailId: emailError === true ? "" : emailError,
            password: passwordError === true ? "" : passwordError,
            re_password: rePasswordError === true ? "" : rePasswordError,
            yearOfBirth: yobError === true ? "" : yobError,
            gender: genderError === true ? "" : genderError,
            skills: skillsError === true ? "" : skillsError,
            photoUrl: "",
            about: "",
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
            const fields = [
                "firstName",
                "lastName",
                "yearOfBirth",
                "skills",
                "gender",
                "photoUrl",
                "about",
            ];
            const payload = {};
            fields.forEach((field) => {
                if (field === "skills") {
                    payload.skills = formData.skills
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                } else if (field === "yearOfBirth") {
                    payload.yearOfBirth = Number(formData.yearOfBirth);
                } else if (formData[field] !== undefined) {
                    payload[field] = formData[field].trim();
                }
            });
            if (isEdit) {
                let response;
                try {
                    response = await axios.patch("/profile/edit", payload);
                } catch (error) {
                    throw error;
                }

                const updatedUser = response.data?.user ||
                    response.data?.data || {
                        ...currentUser,
                        ...payload,
                    };

                dispatch(addUser(updatedUser));
                setSuccessMsg("Profile updated successfully!");

                if (onSuccess) {
                    onSuccess(updatedUser);
                } else {
                    setTimeout(() => {
                        navigate("/profile");
                    }, 1200);
                }
            } else {
                payload.emailId = formData.emailId;
                payload.password = formData.password;
                const response = await axios.post("/auth/signup", payload);
                const userData = response.data?.user;

                if (userData) {
                    dispatch(addUser(userData));
                    navigate("/");
                } else {
                    navigate("/login");
                }
            }
        } catch (err) {
            console.error(
                `${isEdit ? "Update profile" : "Signup"} error:`,
                err,
            );
            const apiMessage =
                err.response?.data?.message ||
                (typeof err.response?.data === "string"
                    ? err.response?.data
                    : "") ||
                err.message ||
                `${isEdit ? "Profile update" : "Registration"} failed. Please try again.`;
            setErrors((prev) => ({ ...prev, api: apiMessage }));
        } finally {
            setIsLoading(false);
        }
    };

    const maxBirthYear = new Date().getFullYear() - 10;

    return (
        <div className="card bg-base-300 w-full max-w-lg shadow-xl mx-auto my-6 border border-base-200">
            <div className="card-body p-6">
                {isEdit && (
                    <Link
                        to="/profile"
                        className="btn btn-ghost btn-sm gap-2 self-start text-base-content/70 hover:text-base-content -mt-2 -ml-2"
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
                )}

                <h1 className="card-title justify-center text-2xl font-bold">
                    {isEdit ? "Edit Profile" : "Sign Up"}
                </h1>
                <p className="text-center text-xs text-base-content/60 -mt-1">
                    {isEdit
                        ? "Update your Dev Connect profile information"
                        : "Join the Dev Connect developer community"}
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3 mt-3"
                >
                    <div className="flex gap-3">
                        <Input
                            id="firstName"
                            required={true}
                            label="First Name"
                            placeholder="John"
                            value={formData.firstName}
                            onHandleChange={handleChange}
                            onHandleBlur={handleBlur}
                            error={errors.firstName}
                        />
                        <Input
                            id="lastName"
                            required={true}
                            label="Last Name"
                            placeholder="Doe"
                            value={formData.lastName}
                            onHandleChange={handleChange}
                            onHandleBlur={handleBlur}
                            error={errors.lastName}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label
                            className="label label-text font-medium"
                            htmlFor="email"
                        >
                            Email{" "}
                            {isEdit ? (
                                <span className="text-xs text-base-content/50 font-normal">
                                    (Cannot be changed)
                                </span>
                            ) : (
                                <span className="text-error">*</span>
                            )}
                        </label>
                        <input
                            id="email"
                            name="emailId"
                            type="email"
                            value={formData.emailId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="email"
                            disabled={isEdit}
                            className={`input input-bordered w-full ${
                                isEdit
                                    ? "opacity-75 cursor-not-allowed bg-base-200"
                                    : ""
                            } ${errors.emailId ? "input-error" : ""}`}
                            placeholder="john.doe@example.com"
                        />
                        {errors.emailId && (
                            <span className="text-error text-xs mt-1">
                                {errors.emailId}
                            </span>
                        )}
                    </div>

                    {!isEdit && (
                        <>
                            <Password
                                required={true}
                                label={"Password"}
                                id="password"
                                value={formData.password}
                                placeholder="Password (e.g. Password@123)"
                                onHandleChange={handleChange}
                                onHandleBlur={handleBlur}
                                error={errors.password}
                            />
                            <Password
                                required={true}
                                label={"Re-enter Password"}
                                id="re_password"
                                value={formData.re_password}
                                placeholder="Re-enter Password (e.g. Password@123)"
                                onHandleChange={handleChange}
                                onHandleBlur={handleBlur}
                                error={errors.re_password}
                            />
                        </>
                    )}

                    <div className="flex gap-3">
                        <Input
                            id="yearOfBirth"
                            name="yearOfBirth"
                            required={true}
                            label={"Year of Birth"}
                            value={formData.yearOfBirth}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="2000"
                            max={maxBirthYear}
                            min={new Date().getFullYear() - 100}
                            type="number"
                            info={`Min. ${10} yrs old (${maxBirthYear} or earlier)`}
                            error={errors.yearOfBirth}
                        />

                        <div className="flex flex-col w-1/2">
                            <label
                                htmlFor="gender"
                                className="label label-text font-medium"
                            >
                                Gender<span className="text-error">*</span>
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`select select-bordered w-full ${
                                    errors.gender ? "select-error" : ""
                                }`}
                            >
                                <option value="">Select One</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Others">Others</option>
                            </select>
                            {errors.gender && (
                                <span className="text-error text-xs mt-1">
                                    {errors.gender}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label
                            htmlFor="skills"
                            className="label label-text font-medium"
                        >
                            Skills{" "}
                            <span className="text-xs text-base-content/60 font-normal">
                                (comma-separated)
                            </span>
                        </label>
                        <input
                            type="text"
                            id="skills"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="React, Node.js, MongoDB"
                            className={`input input-bordered w-full ${
                                errors.skills ? "input-error" : ""
                            }`}
                        />
                        {errors.skills && (
                            <span className="text-error text-xs mt-1">
                                {errors.skills}
                            </span>
                        )}
                    </div>
                    {isEdit && (
                        <>
                            <div className="flex flex-col">
                                <label
                                    htmlFor="photoUrl"
                                    className="label label-text font-medium"
                                >
                                    Photo URL
                                </label>
                                <input
                                    type="url"
                                    id="photoUrl"
                                    name="photoUrl"
                                    value={formData.photoUrl}
                                    onChange={handleChange}
                                    placeholder="https://example.com/avatar.jpg"
                                    className="input input-bordered w-full"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label
                                    htmlFor="about"
                                    className="label label-text font-medium"
                                >
                                    About (Bio)
                                </label>
                                <textarea
                                    id="about"
                                    name="about"
                                    value={formData.about}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Tell the community about your coding journey and interests..."
                                    className="textarea textarea-bordered w-full"
                                ></textarea>
                            </div>
                        </>
                    )}

                    {errors.api && (
                        <div
                            role="alert"
                            className="alert alert-error alert-soft text-sm py-2"
                        >
                            <span>{errors.api}</span>
                        </div>
                    )}

                    {successMsg && (
                        <div
                            role="alert"
                            className="alert alert-success alert-soft text-sm py-2"
                        >
                            <span>{successMsg}</span>
                        </div>
                    )}

                    <div className="flex flex-col gap-2 mt-2">
                        <button
                            className="btn btn-primary w-full"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner loading-xs"></span>
                                    {isEdit
                                        ? "Saving Changes..."
                                        : "Creating Account..."}
                                </>
                            ) : isEdit ? (
                                "Save Changes"
                            ) : (
                                "Sign Up"
                            )}
                        </button>

                        {isEdit ? (
                            <Link
                                to="/profile"
                                className="btn btn-ghost btn-sm w-full"
                            >
                                Cancel
                            </Link>
                        ) : (
                            <p className="mt-2 text-center text-sm">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="link link-primary font-medium"
                                >
                                    Login
                                </Link>
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
