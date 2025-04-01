import axios from "axios";
const serverURL = "http://localhost:8080";

export const signIn = async (udata) => {
  const { data } = await axios.post(serverURL + "/SignIn", udata);
  console.log(data);
  if (data.status === "done") {
    window.localStorage.setItem("token", data.token);
  }
  return data;
};

export const signUp = async (udata) => {
  const { data } = await axios.post(serverURL + "/SignUp", udata);
  console.log(data);
  if (data.status === "done") {
    window.localStorage.setItem("token", data.token);
  }

  return data;
};

export const addPost = async (post) => {
  const { data } = await axios.post(serverURL + "/addPost", post, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
      // Add other headers as needed
    },
  });
  console.log(data);
  return data;
};