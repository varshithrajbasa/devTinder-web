import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";

const NavBar = () => {
    const user = useSelector((store) => store.user);
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="navbar bg-base-300 shadow-sm">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">Dev Tinder</a>
            </div>
            <div className="flex-none">
                {user ? (
                    <ul className="menu menu-horizontal px-1">
                        <li>
                            <details>
                                <summary>{user.firstName}</summary>
                                <ul className="bg-base-200 rounded-t-none p-2">
                                    <li>
                                        <a>Link 1</a>
                                    </li>
                                    <li>
                                        <a>Link 2</a>
                                    </li>
                                </ul>
                            </details>
                        </li>
                    </ul>
                ) : (
                    <button
                        className="btn btn-primary"
                        onClick={() =>
                            navigate(
                                location.pathname === "/signup"
                                    ? "/login"
                                    : "/signup",
                            )
                        }
                    >
                        {location.pathname === "/signup"
                            ? "Login"
                            : location.pathname === "/login"
                              ? "Signup"
                              : "Login / Signup"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default NavBar;
