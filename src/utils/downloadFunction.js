import { useNavigate } from "react-router";
import { privateAxios } from "../api/axios";
import { Logger } from "../Logger/Logger";
export const downloadFunction = async (
    filename,
    setToasterDetails,
    id,
    myRef,
    downloadUrl,

    navigate
) => {
    Logger.debug("navigate = ", navigate);
    try {
        const response = await privateAxios.get(
            id ? downloadUrl + id + `/download` : downloadUrl,
            {
                responseType: "blob",
            }
        );
        Logger.debug(`resposne from ${filename}  assessment `, response);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement(`a`);
        link.href = url;
        let date =
            new Date().getDate() < 10
                ? "0" + new Date().getDate().toString()
                : new Date().getDate().toString();
        let month =
            new Date().getMonth() < 10
                ? "0" + (new Date().getMonth() + 1).toString()
                : new Date().getMonth().toString();
        let year = new Date().getFullYear().toString();
        let hours = new Date().getHours();
        let minutes = new Date().getMinutes();
        let seconds = new Date().getSeconds();
        let timeStamp = month + date + year + "_" + hours + minutes + seconds;
        link.setAttribute(`download`, `${filename} - ${timeStamp}.xls`);
        document.body.appendChild(link);
        link.click();
        if (response.status == 200) {
            setToasterDetails(
                {
                    titleMessage: `Success!`,
                    descriptionMessage: response.data.message,

                    messageType: `success`,
                },
                () => myRef.current()
            );
        }
    } catch (error) {
        Logger.debug(`Error from ${filename}  Assessment`, error);
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
