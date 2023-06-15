import { privateAxios } from "../api/axios";
import { Logger } from "../Logger/Logger";
import { catchError } from "./CatchError";


export const getTimeStamp = () => {
  let month =
    new Date().getMonth() < 10
      ? "0" + (new Date().getMonth() + 1).toString()
      : new Date().getMonth().toString();
  let date =
    new Date().getDate() < 10
      ? "0" + new Date().getDate().toString()
      : new Date().getDate().toString();
  let hours = new Date().getHours();
  let year = new Date().getFullYear().toString();
  let minutes = new Date().getMinutes();
  let seconds = new Date().getSeconds();
  let timeStamp = month + date + year + "_" + hours + minutes + seconds;
  return timeStamp;
};
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
    let timeStamp = getTimeStamp()
    link.setAttribute(`download`, `${filename} - ${timeStamp}.xlsx`);
    document.body.appendChild(link);
    link.click();
    if (response.status == 200) {
      setToasterDetails(
        {
          titleMessage: `Success!`,
          descriptionMessage: "Downloaded Successfully!",

          messageType: `success`,
        },
        () => myRef.current()
      );
    }
  } catch (error) {
    Logger.debug(`Error from ${filename}  Assessment`, error);
    catchError(error, setToasterDetails, myRef, navigate);
    return error;
  }
};
