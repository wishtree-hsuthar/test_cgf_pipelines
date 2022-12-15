import { privateAxios } from "../api/axios";
import { DOWNLOAD_ASSESSMENT_BY_ID } from "../api/Url";

export const downloadFunction = async (
    filename,
    setToasterDetails,
    id,
    myRef,
    downloadUrl
) => {
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
            `${filename} - ${new Date().toLocaleString()}.xls`
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
    }
};
