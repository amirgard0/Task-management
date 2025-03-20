import { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate()
    useEffect(() => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        window.location.reload()
        navigate("/login");
    });

    return (
        <div>
            <h1>logging out</h1>
        </div>
    )
}

export default Logout;