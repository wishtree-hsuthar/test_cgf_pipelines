import React from "react";

export const Dashboard = (props) => {
    console.log(props);
    return (
        <div className="page-wrapper">
            <section>
                <div className="container">
                    <h1>Dashboard in progress</h1>
                    <img
                        src={
                            process.env.PUBLIC_URL +
                            "/images/WorkInProgress-removebg-preview.png"
                        }
                        style={{
                            margin: "0% 25%",
                        }}
                    />
                </div>
            </section>
        </div>
    );
};
