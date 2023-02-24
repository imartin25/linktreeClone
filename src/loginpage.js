import React from "react";
import { useAuth0 } from "@auth0/auth0-react";


const LoginPage = () => {
    const { loginWithRedirect } = useAuth0();
    return (
        <div>
            <h1>Welcome to my Linktree clone project.</h1>
            <p>Click the login button below to enter my app</p>
            <button onClick={() => loginWithRedirect()}>Login</button>
        </div>
    )
}

export default LoginPage;