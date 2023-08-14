import React from "react";
import { Button } from "antd";

const SubmitButton = ({ onSubmit }) => {
  const handleSubmitClick = () => {
    console.log("submitting")
    onSubmit();
  };

  return (
    <div style={{ marginBottom: 20, marginLeft: 10 , color: '#6CB4EE' }}>
      <Button type="dashed" onClick={handleSubmitClick} >
        Save
      </Button>
    </div>
  );
};

export default SubmitButton;
