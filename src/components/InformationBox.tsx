import { useState } from "react";
import Modal from "react-modal";

export default function InformationBox() {
  const [modalIsOpen, setIsOpen] = useState(true);

  return (
    <Modal
      isOpen={modalIsOpen}
    >
    </Modal>
  );
}
