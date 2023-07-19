const queryString = window.location.search;
const params = new URLSearchParams(queryString);

const paramDebug = params.get("debug");
export const Logger = {
  debug(str) {
    if (paramDebug === "1") {
      console.log(str);
    } else {
      console.log = () => {};
    }
  },

  info(str) {
    if (queryString === "?debug=1" || queryString === "?info=1") {
      console.info(str);
    } else {
      console.info = () => {};
    }
  },

  error(value) {
    if (
      queryString === "?debug=1" ||
      queryString === "?info=1" ||
      queryString === "?error=1"
    ) {
      console.error(value);
    } else {
      console.error = () => {};
    }
  },
};
