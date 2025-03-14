import { useState } from "react";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
function Auth({ setUser, user }) {
  const [login, setLogin] = useState(true);

  if (login) {
    return <SignIn user={user} setUser={setUser} setLogInPage={setLogin} />;
  } else {
    return <SignUp user={user} setUser={setUser} setLogInPage={setLogin} />;
  }
}
export default Auth;