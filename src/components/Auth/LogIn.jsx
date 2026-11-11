import React from "react";

const LogIn = () => {
    const handleLogin = (e) => {
        e.preventDefault();
        // Handle login logic here
    }

    return (
        <div className="card bg-base-300 w-80 shadow-sm mx-auto my-10">
            <h1 className="card-title justify-center">Login</h1>
            <fieldset className="fieldset p-4">
                <label className="label" htmlFor="email">
                    Email
                </label>
                <input id="email" type="email" pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" autoComplete="email" className="input" placeholder="Email" />

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
                />

                <button className="btn btn-neutral mt-4" onClick={handleLogin}>
                    Login
                </button>
            </fieldset>
        </div>
    );
};

export default LogIn;
