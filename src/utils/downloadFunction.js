import { useNavigate } from "react-router";
import { privateAxios } from "../api/axios";

export const downloadFunction = async (
    filename,
    setToasterDetails,
    id,
    myRef,
    downloadUrl,

    navigate
) => {
    console.log("navigate = ", navigate);
    try {
        const response = await privateAxios.get(
            id ? downloadUrl + id + `/download` : downloadUrl,
            {
                responseType: "blob",
            }
        );
        console.log(`resposne from ${filename}  assessment `, response);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement(`a`);
        link.href = url;
        link.setAttribute(
            `download`,
            `${filename} - ${new Date().toLocaleString("en")}.xls`
        );
        document.body.appendChild(link);
        link.click();
        if (response.status == 200) {
            setToasterDetails(
                {
                    titleMessage: `Success!`,
                    descriptionMessage: `Download successfull!`,

                    messageType: `success`,
                },
                () => myRef.current()
            );
        }
    } catch (error) {
        console.log(`Error from ${filename}  Assessment`, error);
        if (error.response.status == 401) {
            setToasterDetails(
                {
                    titleMessage: `Oops!`,
                    descriptionMessage: `Session Timeout: Please login again!`,

                    messageType: `error`,
                },
                () => myRef.current()
            );
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        }
        return error;
    }
};
