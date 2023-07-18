import React from "react";
import { Button } from "antd";

const SignOutButton = ({ onSignOut }) => {
  const handleSignOutClick = () => {
    onSignOut();
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <Button type="primary" onClick={handleSignOutClick}>
        Sign Out
      </Button>
    </div>
  );
};

export default SignOutButton;
