import { useSelector } from "react-redux";
import SignUp from "../Auth/SignUp";

const EditProfile = () => {
    const user = useSelector((store) => store.user);

    return (
        <SignUp
            key={user?._id || user?.emailId || "edit-profile"}
            isEdit={true}
            user={user}
        />
    );
};

export default EditProfile;
