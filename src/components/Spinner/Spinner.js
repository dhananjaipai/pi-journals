import React from "react";
import { Spinner } from "react-rainbow-components";

export default ({ show }) => {
  return (
    <>
      {show && (
        <div className="overlay">
          <Spinner size="large" />
        </div>
      )}
    </>
  );
};
