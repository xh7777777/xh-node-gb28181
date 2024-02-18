import LayoutWrapper from "../components/LayoutWrapper";
import { Outlet } from "react-router-dom";

export default function Root() {
    return (
        <LayoutWrapper>
            <div id="detail">
                <Outlet />
            </div>
        </LayoutWrapper>
    );
} 