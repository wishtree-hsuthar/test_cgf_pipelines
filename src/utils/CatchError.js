export const catchError = async (
  error,
  setToasterDetails,
  myRef,
  navigate,
  route,
  state = 0
) => {
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
  } else if (error?.response?.status === 403) {
    setToasterDetails(
      {
        titleMessage: `Oops!`,
        descriptionMessage: error?.response?.data?.message
          ? error?.response?.data?.message
          : "Oops! Something went wrong. Please try again later.",

        messageType: `error`,
      },
      () => myRef.current()
    );
    setTimeout(() => {
      navigate("/home");
    }, 3000);
  } else {
    setToasterDetails(
      {
        titleMessage: `Oops!`,
        descriptionMessage: error?.response?.data?.message
          ? error?.response?.data?.message
          : "Oops! Something went wrong. Please try again later.",

        messageType: `error`,
      },
      () => myRef.current()
    );
    if (route) {
      setTimeout(() => {
        navigate(route,{state});
      }, 3000);
    }
  }
};
