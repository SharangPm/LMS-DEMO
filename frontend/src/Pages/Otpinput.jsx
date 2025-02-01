import React, { useState, useRef } from "react";

const OtpInput = ({ otpLength = 6, onOtpChange }) => {
  const [otp, setOtp] = useState(new Array(otpLength).fill(""));
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < otpLength - 1) {
      inputs.current[index + 1].focus();
    }

    onOtpChange(newOtp.join(""));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <div className="otp-container">
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          className="otp-input"
          value={data}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputs.current[index] = el)}
          maxLength={1}
        />
      ))}
    </div>
  );
};

export default OtpInput;