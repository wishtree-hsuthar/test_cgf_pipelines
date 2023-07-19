import "../Pages/fallbackUI.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "../utils/useDocumentTitle";



function FallBackUI() {
    //custom hook to set title of page
useDocumentTitle("")
    
    useEffect(() => {
        document.body.classList.add("login-page");
        return () => {
            document.body.classList.remove("login-page");
        };
    }, []);

    const navigate = useNavigate();
    return (
        <div className="page-wrapper">
            <section>
                <div className="container">
                    <div className="fallbackUI-sect">
                    <div className="fallbackUI-imgblk">
                        <img
                            src={process.env.PUBLIC_URL + "/images/404.svg"}
                        />
                        <div className="fallbackUI-txtblk">
                            <p className="oops">OOPS...</p>
                            <p className="error-status">404</p>
                            <p className="page-not-found">PAGE NOT FOUND</p>
                            <div className="form-btn text-center">
                            <button
                                // type="submit"
                                onClick={() => navigate("/home")}
                                className="primary-button"
                            >
                                Back to Home
                            </button>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default FallBackUI;
