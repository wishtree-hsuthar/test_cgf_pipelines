import { RESEND_INVITE } from "../api/Url";
import { privateAxios } from "../api/axios";
import { catchError } from "./CatchError";

export const ResendEmail = async (
  inviteid,
  setToasterDetails,
  myRef,
  navigate
) => {
  try {
    const response = await privateAxios.get(RESEND_INVITE + inviteid);
    if (response.status == 200) {
      setToasterDetails(
        {
          titleMessage: `Success!`,
          descriptionMessage: "Invite sent successfully!",

          messageType: `success`,
        },
        () => myRef.current()
      );
    }
  } catch (error) {
    catchError(error, setToasterDetails, myRef, navigate);
  }
};
