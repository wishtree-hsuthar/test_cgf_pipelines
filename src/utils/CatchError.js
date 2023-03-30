export const catchError = async (
  error,
  setToasterDetails,
  myRef,
  navigate,
  route
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
          : "Something went wrong",

        messageType: `error`,
      },
      () => myRef.current()
    );
    setTimeout(() => {
      navigate("/home");
    }, 3000);
  } else {
    console.log("Else block");
    console.log("route = ", route);
    console.log("erro in else block", error);
    setToasterDetails(
      {
        titleMessage: `Oops!`,
        descriptionMessage: error?.response?.data?.message
          ? error?.response?.data?.message
          : "Something went wrong",

        messageType: `error`,
      },
      () => myRef.current()
    );
    if (route) {
      setTimeout(() => {
        navigate(route);
      }, 3000);
    }
  }
};
