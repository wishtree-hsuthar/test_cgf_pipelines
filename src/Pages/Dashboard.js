import React from "react";

export const Dashboard = (props) => {
    console.log(props);
    return (
        <div className="page-wrapper">
            <section>
                <div className="container">
                    <div className="dashboard-sect">
                        <img
                            src={
                                process.env.PUBLIC_URL +
                                "/images/WorkInProgress-removebg-preview.png"
                            }
                            className="mb-30"
                        />
                        <h1 className="coming-soon-txt">Coming Soon!</h1>
                    </div>
                </div>
            </section>
        </div>
    );
};
