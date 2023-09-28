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
      <div className="flex flex-col h-full font-sans">
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsOpen(false)}
            className="focus:outline-none"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 0 24 24"
              width="20"
              className="h-5 w-5"
            >
              <path
                fill="#ffffff"
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </Modal>
  );
}
