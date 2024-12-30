import axios from "axios";
const serverURL = "localhost:8080";

export const signIn = async (udata) => {
  const { data } = await axios.post(serverURL + "/SignIn", udata);

  if (data.status == "done") {
    window.localStorage.setItem("token", data.token);
  }
  return data;
};

export const signUp = async (udata) => {
  const { data } = await axios.post(serverURL + "/SignUp", udata);
  if (data.status == "done") {
    window.localStorage.setItem("token", data.token);
  }

  return data;
};
