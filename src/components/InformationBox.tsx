import { useState } from "react";
import Modal from "react-modal";

export default function InformationBox() {
  const [modalIsOpen, setIsOpen] = useState(true);
  const customStyles = {
    content: {
      maxWidth: "520px",
      width: "100%",
      height: "650px",
      background: "#121213",
      color: "#fff",
      border: "1px solid #1a1a1b",
      borderColor: "#1a1a1b",
      borderRadius: "10px",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      style={customStyles}
      overlayClassName="bg-transparent"
    >
    </Modal>
  );
}
