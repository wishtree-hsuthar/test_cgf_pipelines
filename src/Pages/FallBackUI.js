import "../Pages/fallbackUI.css";

import { useNavigate } from "react-router-dom";

function FallBackUI() {
    const navigate = useNavigate();
    return (
        <div className="page-wrapper">
            <section>
                <div className="container">
                    <div className="section-div">
                        <p className="oops">OOPS...</p>
                        <p className="error-status">404</p>

                        <img
                            src={process.env.PUBLIC_URL + "/images/404.svg"}
                            style={{ margin: "0% 25%" }}
                        />
                        <p className="page-not-found">PAGE NOT FOUND</p>
                        <button
                            // type="submit"
                            onClick={() => navigate("/home")}
                            className="dashboard-button"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default FallBackUI;
