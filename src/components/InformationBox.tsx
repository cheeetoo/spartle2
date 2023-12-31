import { Dispatch, SetStateAction, useEffect } from "react";
import Modal from "react-modal";

interface Props {
  modalIsOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function InformationBox({ modalIsOpen, setIsOpen }: Props) {
  useEffect(() => {
    if (
      !document.cookie.split("; ").find((row) => row.startsWith("seen=")) &&
      window.innerWidth > 768
    ) {
      setIsOpen(true);
      document.cookie = `seen=true; max-age=${
        365 * 24 * 60 * 60
      }; SameSite=None; Secure`;
    }
  }, [setIsOpen]);
  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(5px)",
    },
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
    <Modal isOpen={modalIsOpen} style={customStyles} ariaHideApp={false}>
      <div className="flex flex-col h-full font-sans px-2">
        <div className="flex justify-between items-center">
          <h1 className="font-bold font-sans text-3xl">How To Play</h1>
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
        <div className="text-xl">Guess the Spartle in 6 tries.</div>
        <div className="text-lg">
          <li className="py-2">Each guess must be a valid 5-letter word.</li>
          <li className="pb-2 ">
            The color of the tiles will change to show how close your guess was
            to the word.
          </li>
        </div>
        <div className="font-bold text-xl">Examples</div>
        <div className="my-2 flex">
          <div className="text-[2em] text-[white] uppercase font-bold flex justify-center items-center select-none w-10 h-10 mr-1 bg-[#004a8f]">
            <p className="text-2xl">C</p>
          </div>
          <div className="tile w-10 h-10 mr-1">
            <p className="text-2xl">L</p>
          </div>
          <div className="tile w-10 h-10 mr-1">
            <p className="text-2xl">A</p>
          </div>
          <div className="tile w-10 h-10 mr-1">
            <p className="text-2xl">S</p>
          </div>
          <div className="tile w-10 h-10">
            <p className="text-2xl">S</p>
          </div>
        </div>
        <div className="text-xl">
          <b>C</b> is in the word and in the correct spot.
        </div>
        <div className="my-2 flex">
          <div className="tile w-10 h-10 mr-1">
            <p className="text-2xl">N</p>
          </div>
          <div className="text-[2em] text-[white] uppercase font-bold flex justify-center items-center select-none w-10 h-10 mr-1 bg-[#fec10b]">
            <p className="text-2xl">O</p>
          </div>
          <div className="tile w-10 h-10 mr-1">
            <p className="text-2xl">T</p>
          </div>
          <div className="tile w-10 h-10 mr-1">
            <p className="text-2xl">E</p>
          </div>
          <div className="tile w-10 h-10">
            <p className="text-2xl">S</p>
          </div>
        </div>
        <div className="text-xl">
          <b>O</b> is in the word but in the correct spot.
        </div>
        <div className="my-2 flex">
          <div className="tile w-10 h-10 mr-1">
            <p className="text-2xl">B</p>
          </div>
          <div className="tile w-10 h-10 mr-1">
            <p className="text-2xl">O</p>
          </div>
          <div className="tile w-10 h-10 mr-1">
            <p className="text-2xl">O</p>
          </div>
          <div className="text-[2em] text-[white] uppercase font-bold flex justify-center items-center select-none w-10 h-10 mr-1 bg-[#39393c]">
            <p className="text-2xl">K</p>
          </div>
          <div className="tile w-10 h-10">
            <p className="text-2xl">S</p>
          </div>
        </div>
        <div className="text-xl">
          <b>K</b> is not in the word in any spot.
        </div>
        <hr className="my-4" />
        <span className="text-xl">
          Brought to you by the SPA Computer Science Club.
        </span>
        <hr className="my-4" />
        <a
          href="https://forms.gle/4zvHKdqVoMJSTmg4A"
          className="text-gray-400 text-xl"
        >
          Report a bug or suggest a feature.
        </a>
      </div>
    </Modal>
  );
}
