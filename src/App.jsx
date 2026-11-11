import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Body from "./components/Layout/Body";
import LogIn from "./components/Auth/LogIn";
import SignUp from "./components/Auth/SignUp";
import LogOut from "./components/Auth/LogOut";

function App() {
    return (
        <>
            <BrowserRouter basename={import.meta.env.BASE_URL}>
                <Routes>
                    <Route path="/" element={<Body />}>
                        <Route path="/login" element={<LogIn />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/logout" element={<LogOut />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
