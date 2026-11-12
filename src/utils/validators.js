const emailValidator = (emailId) => {
    if (!emailId || !emailId.trim()) {
        return "Email is required.";
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailPattern.test(emailId.trim())) {
        return true;
    } else {
        return "Please enter valid email.";
    }
};

const passwordValidator = (password) => {
    if (!password) {
        return "Password is required.";
    }
    const pass = password.trim();
    if (pass.length < 8) {
        return "Password must be at least 8 characters.";
    } else if (pass.length > 20) {
        return "Password must be at most 20 characters.";
    } else {
        const passwordPattern =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        if (passwordPattern.test(pass)) {
            return true;
        } else {
            return "Password must contain uppercase, lowercase, number and special character (@$!%*?&).";
        }
    }
};

const nameValidator = (name, fieldName = "Name") => {
    if (!name || !name.trim()) {
        return `${fieldName} is required.`;
    }
    const trimmed = name.trim();
    if (trimmed.length < 2) {
        return `${fieldName} must be at least 2 characters.`;
    }
    if (trimmed.length > 50) {
        return `${fieldName} must be at most 50 characters.`;
    }
    const namePattern = /^[a-zA-Z\s'-]+$/;
    if (!namePattern.test(trimmed)) {
        return `${fieldName} should only contain letters.`;
    }
    return true;
};

const ageValidator = (age) => {
    if (age === "" || age === null || age === undefined) {
        return true;
    }
    const num = Number(age);
    if (Number.isNaN(num) || !Number.isInteger(num)) {
        return "Age must be a valid whole number.";
    }
    if (num < 18) {
        return "Age must be at least 18.";
    }
    if (num > 100) {
        return "Please enter a valid age (under 100).";
    }
    return true;
};

const genderValidator = (gender) => {
    if (!gender || gender === "Select One") {
        return true;
    }
    const validGenders = ["Male", "Female", "Others", "male", "female", "others"];
    if (!validGenders.includes(gender)) {
        return "Please select a valid gender.";
    }
    return true;
};

const skillsValidator = (skills) => {
    if (!skills || (typeof skills === "string" && !skills.trim())) {
        return true;
    }
    const skillsList = Array.isArray(skills)
        ? skills
        : skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    if (skillsList.length > 20) {
        return "You can add up to 20 skills.";
    }
    return true;
};

export {
    emailValidator,
    passwordValidator,
    nameValidator,
    ageValidator,
    genderValidator,
    skillsValidator,
};
