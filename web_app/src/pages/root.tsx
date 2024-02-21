import LayoutWrapper from "../components/LayoutWrapper";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { redirect } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Root() {
    const navigate = useNavigate();
    const status = useAuth();
    if (status === 'loading') {
        return <div>Loading...</div>
    } else if (status === 'unauthenticated') {
        navigate('/login');
        return <div>Redirecting...</div>
    }

    return (
        <LayoutWrapper>
            <div id="detail">
                <Outlet />
            </div>
        </LayoutWrapper>
    );
} 