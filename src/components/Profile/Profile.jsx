import { useSelector } from "react-redux";
import { Link } from "react-router";

const Profile = () => {
    const user = useSelector((store) => store.user);

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
                    <h2 className="text-2xl font-bold mb-2">
                        Profile Unavailable
                    </h2>
                    <p className="text-base-content/70 mb-6">
                        You need to be logged in to view your profile and manage
                        your account.
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

    const {
        firstName = "Developer",
        lastName = "",
        emailId = "",
        photoUrl = "",
        gender,
        about,
        skills = [],
        createdAt,
    } = user;

    const yearOfBirth =
        user.yearOfBirth ||
        (user.age ? new Date().getFullYear() - user.age : null);
    const age =
        user.age ||
        (yearOfBirth ? new Date().getFullYear() - yearOfBirth : null);

    const fullName = `${firstName} ${lastName}`.trim();
    const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        fullName,
    )}&background=6366f1&color=fff&size=256`;
    const avatarSrc = photoUrl || fallbackAvatar;

    const formattedDate = createdAt
        ? new Date(createdAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
          })
        : "Recently";

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 pb-12 w-full">
            <div className="card bg-base-300 shadow-xl overflow-hidden border border-base-200 mb-8">
                <div className="h-36 md:h-48 bg-gradient-to-r from-primary via-secondary to-accent relative">
                    <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px]"></div>
                    <div className="absolute top-4 right-4 flex gap-2">
                        <Link
                            to="/profile/edit"
                            className="btn btn-sm btn-neutral bg-base-100/90 text-base-content hover:bg-base-100 border-none shadow-md backdrop-blur-sm"
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
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                            </svg>
                            Edit Profile
                        </Link>
                        <Link
                            to="/profile/change-password"
                            className="btn btn-sm btn-neutral bg-base-100/90 text-base-content hover:bg-base-100 border-none shadow-md backdrop-blur-sm"
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
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                            Change Password
                        </Link>
                    </div>
                </div>

                {/* Profile Header Details */}
                <div className="card-body pt-0 px-6 pb-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-16 sm:-mt-20 mb-3">
                        <div className="avatar">
                            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full ring-4 ring-base-100 shadow-2xl bg-base-200 overflow-hidden">
                                <img
                                    src={avatarSrc}
                                    alt={fullName}
                                    className="object-cover w-full h-full"
                                    onError={(e) => {
                                        e.target.src = fallbackAvatar;
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                    {fullName}
                                </h1>
                                {user.isVerified && (
                                    <svg
                                        width="20px"
                                        height="20px"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M9 12L11 14L15.5 9.5M17.9012 4.99851C18.1071 5.49653 18.5024 5.8924 19.0001 6.09907L20.7452 6.82198C21.2433 7.02828 21.639 7.42399 21.8453 7.92206C22.0516 8.42012 22.0516 8.97974 21.8453 9.47781L21.1229 11.2218C20.9165 11.7201 20.9162 12.2803 21.1236 12.7783L21.8447 14.5218C21.9469 14.7685 21.9996 15.0329 21.9996 15.2999C21.9997 15.567 21.9471 15.8314 21.8449 16.0781C21.7427 16.3249 21.5929 16.549 21.4041 16.7378C21.2152 16.9266 20.991 17.0764 20.7443 17.1785L19.0004 17.9009C18.5023 18.1068 18.1065 18.5021 17.8998 18.9998L17.1769 20.745C16.9706 21.2431 16.575 21.6388 16.0769 21.8451C15.5789 22.0514 15.0193 22.0514 14.5212 21.8451L12.7773 21.1227C12.2792 20.9169 11.7198 20.9173 11.2221 21.1239L9.47689 21.8458C8.97912 22.0516 8.42001 22.0514 7.92237 21.8453C7.42473 21.6391 7.02925 21.2439 6.82281 20.7464L6.09972 19.0006C5.8938 18.5026 5.49854 18.1067 5.00085 17.9L3.25566 17.1771C2.75783 16.9709 2.36226 16.5754 2.15588 16.0777C1.94951 15.5799 1.94923 15.0205 2.1551 14.5225L2.87746 12.7786C3.08325 12.2805 3.08283 11.7211 2.8763 11.2233L2.15497 9.47678C2.0527 9.2301 2.00004 8.96568 2 8.69863C1.99996 8.43159 2.05253 8.16715 2.15472 7.92043C2.25691 7.67372 2.40671 7.44955 2.59557 7.26075C2.78442 7.07195 3.00862 6.92222 3.25537 6.8201L4.9993 6.09772C5.49687 5.89197 5.89248 5.4972 6.0993 5.00006L6.82218 3.25481C7.02848 2.75674 7.42418 2.36103 7.92222 2.15473C8.42027 1.94842 8.97987 1.94842 9.47792 2.15473L11.2218 2.87712C11.7199 3.08291 12.2793 3.08249 12.7771 2.87595L14.523 2.15585C15.021 1.94966 15.5804 1.9497 16.0784 2.15597C16.5763 2.36223 16.972 2.75783 17.1783 3.25576L17.9014 5.00153L17.9012 4.99851Z"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                )}
                                <div className="flex justify-center sm:justify-start gap-1.5 flex-wrap">
                                    {age && (
                                        <span className="badge badge-secondary font-medium">
                                            {age} yrs
                                        </span>
                                    )}
                                    {gender && (
                                        <span className="badge badge-outline capitalize font-medium">
                                            {gender}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-base-content/70 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                                <svg
                                    className="w-4 h-4 text-primary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                                {emailId}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Layout: 2 Columns on Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Columns: User Details, Bio & Tech Stack */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card bg-base-300 shadow-md border border-base-200">
                        <div className="card-body">
                            <h2 className="card-title text-lg flex items-center gap-2 text-primary">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                About Me
                            </h2>
                            <p className="text-base-content/80 text-sm md:text-base leading-relaxed mt-1">
                                {about?.trim() ? (
                                    about
                                ) : (
                                    <span className="italic text-base-content/50">
                                        No bio added yet. Tell the Dev Connect
                                        community about your tech journey,
                                        passion projects, and what you're
                                        building!
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Skills & Tech Stack */}
                    <div className="card bg-base-300 shadow-md border border-base-200">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <h2 className="card-title text-lg flex items-center gap-2 text-secondary">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                        />
                                    </svg>
                                    Skills & Tech Stack
                                </h2>
                                <span className="badge badge-neutral badge-sm">
                                    {skills.length}{" "}
                                    {skills.length === 1 ? "skill" : "skills"}
                                </span>
                            </div>

                            {skills && skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="badge badge-primary badge-outline font-semibold px-3 py-3 text-xs md:text-sm shadow-xs hover:badge-primary transition-all duration-150"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="italic text-base-content/50 text-sm mt-2">
                                    No skills added yet. Add skills to get
                                    discovered by other developers!
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="card bg-base-300 shadow-md border border-base-200">
                        <div className="card-body">
                            <h2 className="card-title text-lg flex items-center gap-2 text-accent">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                Account Overview
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                <div className="bg-base-200/60 p-3.5 rounded-xl border border-base-200">
                                    <span className="text-xs uppercase tracking-wider text-base-content/60 font-semibold">
                                        First Name
                                    </span>
                                    <p className="font-semibold text-base mt-0.5">
                                        {firstName}
                                    </p>
                                </div>

                                <div className="bg-base-200/60 p-3.5 rounded-xl border border-base-200">
                                    <span className="text-xs uppercase tracking-wider text-base-content/60 font-semibold">
                                        Last Name
                                    </span>
                                    <p className="font-semibold text-base mt-0.5">
                                        {lastName || (
                                            <span className="text-base-content/40">
                                                -
                                            </span>
                                        )}
                                    </p>
                                </div>

                                <div className="bg-base-200/60 p-3.5 rounded-xl border border-base-200">
                                    <span className="text-xs uppercase tracking-wider text-base-content/60 font-semibold">
                                        Gender
                                    </span>
                                    <p className="font-semibold text-base capitalize mt-0.5">
                                        {gender || (
                                            <span className="text-base-content/40">
                                                Not specified
                                            </span>
                                        )}
                                    </p>
                                </div>

                                <div className="bg-base-200/60 p-3.5 rounded-xl border border-base-200">
                                    <span className="text-xs uppercase tracking-wider text-base-content/60 font-semibold">
                                        Year of Birth
                                    </span>
                                    <p className="font-semibold text-base mt-0.5">
                                        {yearOfBirth ? (
                                            `${yearOfBirth}${age ? ` (${age} yrs)` : ""}`
                                        ) : (
                                            <span className="text-base-content/40">
                                                Not specified
                                            </span>
                                        )}
                                    </p>
                                </div>

                                <div className="bg-base-200/60 p-3.5 rounded-xl border border-base-200">
                                    <span className="text-xs uppercase tracking-wider text-base-content/60 font-semibold">
                                        Email
                                    </span>
                                    <p className="font-semibold text-sm break-all mt-0.5">
                                        {emailId}
                                    </p>
                                </div>

                                <div className="bg-base-200/60 p-3.5 rounded-xl border border-base-200">
                                    <span className="text-xs uppercase tracking-wider text-base-content/60 font-semibold">
                                        Member Since
                                    </span>
                                    <p className="font-semibold text-base mt-0.5">
                                        {formattedDate}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-sm font-bold uppercase tracking-wider text-base-content/70">
                            Card Preview
                        </span>
                        <span className="badge badge-success badge-sm font-medium">
                            Live Feed View
                        </span>
                    </div>
                    <div className="aura aura-gold">
                        <div className="card bg-base-300 w-full shadow-2xl overflow-hidden border border-base-200 transition-transform duration-200 hover:-translate-y-1">
                            <figure className="relative h-80 w-full bg-base-200 overflow-hidden">
                                <img
                                    src={avatarSrc}
                                    alt={fullName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = fallbackAvatar;
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <h3 className="text-2xl font-black flex items-center gap-2 drop-shadow-md">
                                        {fullName}
                                        {user.isVerified && (
                                            <svg
                                                width="20px"
                                                height="20px"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M9 12L11 14L15.5 9.5M17.9012 4.99851C18.1071 5.49653 18.5024 5.8924 19.0001 6.09907L20.7452 6.82198C21.2433 7.02828 21.639 7.42399 21.8453 7.92206C22.0516 8.42012 22.0516 8.97974 21.8453 9.47781L21.1229 11.2218C20.9165 11.7201 20.9162 12.2803 21.1236 12.7783L21.8447 14.5218C21.9469 14.7685 21.9996 15.0329 21.9996 15.2999C21.9997 15.567 21.9471 15.8314 21.8449 16.0781C21.7427 16.3249 21.5929 16.549 21.4041 16.7378C21.2152 16.9266 20.991 17.0764 20.7443 17.1785L19.0004 17.9009C18.5023 18.1068 18.1065 18.5021 17.8998 18.9998L17.1769 20.745C16.9706 21.2431 16.575 21.6388 16.0769 21.8451C15.5789 22.0514 15.0193 22.0514 14.5212 21.8451L12.7773 21.1227C12.2792 20.9169 11.7198 20.9173 11.2221 21.1239L9.47689 21.8458C8.97912 22.0516 8.42001 22.0514 7.92237 21.8453C7.42473 21.6391 7.02925 21.2439 6.82281 20.7464L6.09972 19.0006C5.8938 18.5026 5.49854 18.1067 5.00085 17.9L3.25566 17.1771C2.75783 16.9709 2.36226 16.5754 2.15588 16.0777C1.94951 15.5799 1.94923 15.0205 2.1551 14.5225L2.87746 12.7786C3.08325 12.2805 3.08283 11.7211 2.8763 11.2233L2.15497 9.47678C2.0527 9.2301 2.00004 8.96568 2 8.69863C1.99996 8.43159 2.05253 8.16715 2.15472 7.92043C2.25691 7.67372 2.40671 7.44955 2.59557 7.26075C2.78442 7.07195 3.00862 6.92222 3.25537 6.8201L4.9993 6.09772C5.49687 5.89197 5.89248 5.4972 6.0993 5.00006L6.82218 3.25481C7.02848 2.75674 7.42418 2.36103 7.92222 2.15473C8.42027 1.94842 8.97987 1.94842 9.47792 2.15473L11.2218 2.87712C11.7199 3.08291 12.2793 3.08249 12.7771 2.87595L14.523 2.15585C15.021 1.94966 15.5804 1.9497 16.0784 2.15597C16.5763 2.36223 16.972 2.75783 17.1783 3.25576L17.9014 5.00153L17.9012 4.99851Z"
                                                    stroke="currentColor"
                                                    stroke-width="2"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                            </svg>
                                        )}
                                    </h3>
                                    {gender && (
                                        <p className="text-xs uppercase tracking-wider font-semibold text-white/80 capitalize drop-shadow-sm">
                                            {gender}
                                        </p>
                                    )}
                                </div>
                            </figure>

                            <div className="card-body p-5">
                                <p className="text-sm text-base-content/80 line-clamp-3 leading-relaxed">
                                    {about?.trim() ||
                                        "Passionate software engineer looking to connect and collaborate on awesome projects."}
                                </p>

                                {skills && skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {skills.slice(0, 5).map((skill, i) => (
                                            <span
                                                key={i}
                                                className="badge badge-primary badge-outline badge-xs px-2 py-2 font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                        {skills.length > 5 && (
                                            <span className="badge badge-ghost badge-xs px-2 py-2 text-base-content/60">
                                                +{skills.length - 5} more
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="flex justify-center items-center gap-4 mt-4 pt-3 border-t border-base-200">
                                    <button
                                        type="button"
                                        className="btn btn-circle btn-outline btn-error btn-md hover:scale-105 transition-transform"
                                        title="Pass (Preview)"
                                        disabled
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2.5"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-circle btn-outline btn-success btn-md hover:scale-105 transition-transform"
                                        title="Interested (Preview)"
                                        disabled
                                    >
                                        <svg
                                            className="w-5 h-5 fill-current"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/profile/edit"
                            className="btn btn-primary btn-outline btn-sm w-full gap-2 shadow-xs"
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
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                            Update Profile Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
