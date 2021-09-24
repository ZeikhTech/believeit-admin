export const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080/"
    : "https://believeit-dev.herokuapp.com/";
export const apiPath = baseUrl + "api";
export const basePath = "/admin";
