import LayoutWrapper from "../components/LayoutWrapper";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";

export default function Root() {
    const navigate = useNavigate();
    const status = useAuth();
    if (status === 'loading') {
        return <Spin />
    } else if (status === 'unauthenticated') {
        navigate('/login');
        return <div>Redirecting...<Spin></Spin></div>
    }

    return (
        <LayoutWrapper>
            <div id="detail">
                <Outlet />
            </div>
        </LayoutWrapper>
    );
} 