import React from "react";
import { Button } from "antd";

const SignInButton = ({ onSignIn }) => {
  const handleSignInClick = () => {
    onSignIn();
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <Button type="primary" onClick={handleSignInClick}>
        Sign in
      </Button>
    </div>
  );
};

export default SignInButton;
