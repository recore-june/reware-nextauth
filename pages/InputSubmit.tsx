import React, { useEffect, useState } from "react";
import { Button } from "antd";

interface ISubmitProps {
  value: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  loading?: boolean;
}

const defaultStyle = {
  width: "250px",
  height: "42px",
  borderRadius: "5px",
};

export default function InputSubmit({
  value = "",
  disabled = false,
  style,
  loading = false,
}: ISubmitProps) {
  const [styles, setStyles] = useState<React.CSSProperties>(defaultStyle);

  useEffect(() => {
    setStyles({
      ...defaultStyle,
      ...style,
    });
  }, [style]);

  return (
    <Button
      type="primary"
      htmlType="submit"
      className="submitBtn"
      style={styles}
      disabled={disabled}
      loading={loading}
    >
      {value}
    </Button>
  );
}
