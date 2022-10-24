import React, { FC } from "react";

type ButtonProps = {
  variant?: string;
  type?: string;
  text: string;
  bold?: boolean;
  loading?: boolean;
  click?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const Button: FC<ButtonProps> = ({
  variant,
  type,
  text,
  bold,
  loading,
  click,
}) => {
  const btnBgColor = {
    backgroundColor:
      variant === "cyan" ? "#66ffff" : variant === "dark" ? "#b3b3b3" : "white",
    fontWeight: bold ? "700" : "normal",
    minWidth:
      type === "unstyled"
        ? "fit-content"
        : type === "delete"
        ? "70px"
        : type === "add"
        ? "120px"
        : "150px",
    borderRadius: "10px",
    margin:
      type === "unstyled"
        ? "0 5px"
        : type === "delete"
        ? "0 4px 0"
        : type === "add"
        ? "0 5px"
        : "30px 0",
    padding:
      type === "unstyled"
        ? "5px 15px"
        : type === "delete"
        ? "0 4px 0"
        : type === "add"
        ? "3px 10px"
        : "5px 0",
  };

  return (
    <button style={btnBgColor} onClick={click} disabled={loading}>
      {loading ? <i className="fa fa-spinner"></i> : text}
    </button>
  );
};

export default Button;
