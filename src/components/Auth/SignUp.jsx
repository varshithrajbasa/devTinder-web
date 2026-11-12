import { useState } from "react";
import axios from "../../api/apiClient";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { addUser } from "../../utils/userSlice";
import {
    emailValidator,
    passwordValidator,
    nameValidator,
    ageValidator,
    genderValidator,
    skillsValidator,
} from "../../utils/validators";

const SignUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        emailId: "",
        password: "",
        age: "",
        gender: "Select One",
        skills: "",
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        emailId: "",
        password: "",
        age: "",
        gender: "",
        skills: "",
        api: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name] || errors.api) {
            setErrors((prev) => ({ ...prev, [name]: "", api: "" }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let validationResult = true;

        if (name === "firstName") {
            validationResult = nameValidator(value, "First Name");
        } else if (name === "lastName" && value.trim()) {
            validationResult = nameValidator(value, "Last Name");
        } else if (name === "emailId" && value.trim()) {
            validationResult = emailValidator(value);
        } else if (name === "password" && value) {
            validationResult = passwordValidator(value);
        } else if (name === "age" && value !== "") {
            validationResult = ageValidator(value);
        } else if (name === "gender" && value !== "Select One") {
            validationResult = genderValidator(value);
        } else if (name === "skills" && value.trim()) {
            validationResult = skillsValidator(value);
        }

        if (validationResult !== true) {
            setErrors((prev) => ({ ...prev, [name]: validationResult }));
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        const fnError = nameValidator(formData.firstName, "First Name");
        const lnError = formData.lastName.trim()
            ? nameValidator(formData.lastName, "Last Name")
            : true;
        const emailError = emailValidator(formData.emailId);
        const passwordError = passwordValidator(formData.password);
        const ageError = ageValidator(formData.age);
        const genderError = genderValidator(formData.gender);
        const skillsError = skillsValidator(formData.skills);

        const newErrors = {
            firstName: fnError === true ? "" : fnError,
            lastName: lnError === true ? "" : lnError,
            emailId: emailError === true ? "" : emailError,
            password: passwordError === true ? "" : passwordError,
            age: ageError === true ? "" : ageError,
            gender: genderError === true ? "" : genderError,
            skills: skillsError === true ? "" : skillsError,
            api: "",
        };

        const hasErrors = Object.values(newErrors).some((err) => Boolean(err));
        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                emailId: formData.emailId.trim(),
                password: formData.password,
            };

            if (formData.age) {
                payload.age = Number(formData.age);
            }

            if (formData.gender && formData.gender !== "Select One") {
                payload.gender = formData.gender.toLowerCase();
            }

            if (formData.skills && formData.skills.trim()) {
                payload.skills = formData.skills
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
            }

            const response = await axios.post("/auth/signup", payload);
            const userData =
                response.data?.user || response.data?.data || response.data;

            if (
                userData &&
                (userData._id || userData.emailId || userData.firstName)
            ) {
                dispatch(addUser(userData));
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (err) {
            console.error("Signup error:", err);
            const apiMessage =
                err.response?.data?.message ||
                (typeof err.response?.data === "string"
                    ? err.response?.data
                    : "") ||
                err.message ||
                "Registration failed. Please try again.";
            setErrors((prev) => ({ ...prev, api: apiMessage }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card bg-base-300 w-full max-w-md shadow-sm mx-auto my-6">
            <div className="card-body">
                <h1 className="card-title justify-center text-2xl font-bold">
                    Sign Up
                </h1>
                <form
                    onSubmit={handleSignUp}
                    className="flex flex-col gap-3 mt-2"
                >
                    <div className="flex gap-3">
                        <div className="flex flex-col w-1/2">
                            <label
                                htmlFor="firstName"
                                className="label label-text font-medium"
                            >
                                First Name <span className="text-error">*</span>
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="John"
                                className={`input input-bordered w-full ${
                                    errors.firstName ? "input-error" : ""
                                }`}
                            />
                            {errors.firstName && (
                                <span className="text-error text-xs mt-1">
                                    {errors.firstName}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col w-1/2">
                            <label
                                htmlFor="lastName"
                                className="label label-text font-medium"
                            >
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Doe"
                                className={`input input-bordered w-full ${
                                    errors.lastName ? "input-error" : ""
                                }`}
                            />
                            {errors.lastName && (
                                <span className="text-error text-xs mt-1">
                                    {errors.lastName}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label
                            className="label label-text font-medium"
                            htmlFor="email"
                        >
                            Email <span className="text-error">*</span>
                        </label>
                        <input
                            id="email"
                            name="emailId"
                            type="email"
                            value={formData.emailId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="email"
                            className={`input input-bordered w-full ${
                                errors.emailId ? "input-error" : ""
                            }`}
                            placeholder="john.doe@example.com"
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
                            Password <span className="text-error">*</span>
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className={`input input-bordered w-full ${
                                errors.password ? "input-error" : ""
                            }`}
                            placeholder="Password (e.g. Password@123)"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="new-password"
                        />
                        {errors.password && (
                            <span className="text-error text-xs mt-1">
                                {errors.password}
                            </span>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <div className="flex flex-col w-1/2">
                            <label
                                htmlFor="age"
                                className="label label-text font-medium"
                            >
                                Age
                            </label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="21"
                                min="18"
                                max="100"
                                className={`input input-bordered w-full ${
                                    errors.age ? "input-error" : ""
                                }`}
                            />
                            {errors.age && (
                                <span className="text-error text-xs mt-1">
                                    {errors.age}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col w-1/2">
                            <label
                                htmlFor="gender"
                                className="label label-text font-medium"
                            >
                                Gender
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
                                <option value="Select One">Select One</option>
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

                    {errors.api && (
                        <div
                            role="alert"
                            className="alert alert-error alert-soft text-sm py-2"
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
                                Creating Account...
                            </>
                        ) : (
                            "Sign Up"
                        )}
                    </button>

                    <p className="mt-2 text-center text-sm">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="link link-primary font-medium"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
