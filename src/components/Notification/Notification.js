import React from "react";
import { Notification } from "react-rainbow-components";

const style = {
  position: "absolute",
  right: "20px",
  top: "10px",
  zIndex: "100"
};

export default ({ status, onClose }) => {
  const statusMapper = {
    success: {
      title: "Save successful",
      description: "Journal saved successfully",
      status: "success"
    },
    save_error: {
      title: "Save failed",
      description: "Unknown error occured. Check logs.",
      status: "error"
    },
    load_error: {
      title: "Load",
      description: "Unknown error occured. Check logs.",
      status: "error"
    }
  };
  return (
    status && (
      <Notification
        style={style}
        onRequestClose={onClose}
        title={statusMapper[status].title}
        description={statusMapper[status].description}
        icon={statusMapper[status].status}
      />
    )
  );
};
