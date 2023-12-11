import InformationBox from "@/components/InformationBox";
import { useEffect, useRef, RefObject, useState } from "react";

export default function Home() {
  const keyboardRef = useRef<HTMLDivElement>(null);
  const guessGridRef = useRef<HTMLDivElement>(null);
  const alertContainerRef = useRef<HTMLDivElement>(null);

  const [modalIsOpen, setIsOpen] = useState(false);
  const [dictionary, setDictionary] = useState<string[]>([]);
  const [targetWord, setTargetWord] = useState<string>("");
  const [dataFetched, setDataFetched] = useState(false);

  let stopInteraction: () => void;
  let submitGuess: () => void = () => {};

  useEffect(() => {
    stopInteraction = startInteraction(); // eslint-disable-line
    // eslint-disable-next-line react-hooks/exhaustive-deps
    submitGuess = () => {
      // eslint-disable-line
      const activeTiles = Array.from(getActiveTiles(guessGridRef) ?? []);
      if (activeTiles.length !== 5) {
        showAlert("Not enough letters!", 1000);
        shakeTiles(activeTiles);
        return;
      }

      const guess = activeTiles.reduce((word, tile) => {
        return word + (tile as HTMLDivElement).dataset.letter;
      }, "");
      if (!dictionary.includes(guess)) {
        showAlert("Not in word list", 1000);
        shakeTiles(activeTiles);
        return;
      }

      activeTiles.forEach((...params) => flipTile(...params, guess));
    };
    const getData = async () => {
      setDictionary(JSON.parse(await (await fetch("/api/dict")).text()));
      setTargetWord((await (await fetch("/api/word")).json()).word);
      setDataFetched(true);
    };
    getData();

    return () => {
      stopInteraction();
    };
  }, [dataFetched]);

  return (
    <div className="flex flex-col min-h-screen m-0 bg-[#121213] [font-size:_clamp(0.5rem,2.5vmin,1.5rem)]">
      <header className="text-white flex justify-between items-center border-b-2 w-full overflow-hidden p-4 mb-4 border-[#39393c]">
        <div></div>
        <div className="sm:text-4xl font-bold font-sans text-3xl">Spartle</div>
        <button onClick={() => setIsOpen(true)}>
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            height="28"
            viewBox="4 4 24 24"
            width="28"
          >
            <path
              fill="#ffffff"
              d="M14.8333 23H17.1666V20.6667H14.8333V23ZM15.9999 4.33334C9.55992 4.33334 4.33325 9.56001 4.33325 16C4.33325 22.44 9.55992 27.6667 15.9999 27.6667C22.4399 27.6667 27.6666 22.44 27.6666 16C27.6666 9.56001 22.4399 4.33334 15.9999 4.33334ZM15.9999 25.3333C10.8549 25.3333 6.66659 21.145 6.66659 16C6.66659 10.855 10.8549 6.66668 15.9999 6.66668C21.1449 6.66668 25.3333 10.855 25.3333 16C25.3333 21.145 21.1449 25.3333 15.9999 25.3333ZM15.9999 9.00001C13.4216 9.00001 11.3333 11.0883 11.3333 13.6667H13.6666C13.6666 12.3833 14.7166 11.3333 15.9999 11.3333C17.2833 11.3333 18.3333 12.3833 18.3333 13.6667C18.3333 16 14.8333 15.7083 14.8333 19.5H17.1666C17.1666 16.875 20.6666 16.5833 20.6666 13.6667C20.6666 11.0883 18.5783 9.00001 15.9999 9.00001Z"
            ></path>
          </svg>
        </button>
      </header>
      <main className="">
        <InformationBox modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} />
        <div className="alert-container" ref={alertContainerRef}></div>
        <div className="flex flex-col justify-center items-center">
          <div className="guess-grid" ref={guessGridRef}>
            {Array.from({ length: 30 }).map((_, index) => (
              <div className="tile" key={index}></div>
            ))}
          </div>
          <div
            className="grid sm:grid-cols-[repeat(20,_minmax(auto,_1.25em))] sm:auto-rows-[3em] grid-cols-[repeat(20,_minmax(auto,_1.7em))] auto-rows-[3.8em] gap-[0.25em] justify-center"
            ref={keyboardRef}
          >
            {"QWERTYUIOP".split("").map((letter) => (
              <button className="key" data-key={letter} key={letter}>
                {letter}
              </button>
            ))}
            <div className="space"></div>
            {"ASDFGHJKL".split("").map((letter) => (
              <button className="key" data-key={letter} key={letter}>
                {letter}
              </button>
            ))}
            <div className="space"></div>
            <button data-enter className="key large">
              Enter
            </button>
            {"ZXCVBNM".split("").map((letter) => (
              <button className="key" data-key={letter} key={letter}>
                {letter}
              </button>
            ))}
            <button data-delete className="key large" onClick={deleteKey}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 0 24 24"
                width="24"
              >
                <path
                  fill="var(--color-tone-1)"
                  d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );

  function startInteraction() {
    const handleClick = (e: Event) => handleMouseClick(e);
    const handleKey = (e: KeyboardEvent) => handleKeyPress(e);

    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }

  function handleMouseClick(e: any) {
    if (e.target.matches("[data-key]")) {
      pressKey(e.target.dataset.key);
      return;
    }
    if (e.target.matches("[data-enter]")) {
      submitGuess();
      return;
    }
  }

  function handleKeyPress(e: any) {
    if (e.key === "Enter") {
      submitGuess();
      return;
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      deleteKey();
      return;
    }

    if (e.key.match(/^[a-z]$/)) {
      pressKey(e.key);
      return;
    }
  }

  function pressKey(key: any) {
    const activeTiles = getActiveTiles(guessGridRef) ?? [];
    if (activeTiles.length >= 5) {
      return;
    }
    const nextTile = guessGridRef.current?.querySelector(
      ":not([data-letter])",
    ) as HTMLDivElement;
    if (!nextTile) return;
    nextTile.dataset.letter = key.toLowerCase();
    nextTile.textContent = key;
    nextTile.dataset.state = "active";
    nextTile.classList.add("zoom");
    nextTile.addEventListener(
      "animationend",
      () => {
        nextTile.classList.remove("zoom");
      },
      { once: true },
    );
  }

  function deleteKey() {
    const activeTiles = getActiveTiles(guessGridRef);
    if (!activeTiles) return;
    const lastTile = activeTiles[activeTiles.length - 1] as HTMLElement;
    if (!lastTile) return;
    lastTile.textContent = "";
    delete lastTile.dataset.state;
    delete lastTile.dataset.letter;
  }

  function flipTile(tile: any, index: any, array: any, guess: any) {
    const letter = tile.dataset.letter;
    const key = keyboardRef.current?.querySelector(`[data-key="${letter}"i]`);
    if (!key) return;
    setTimeout(
      () => {
        tile.classList.add("flip");
      },
      (index * 500) / 2,
    ); // NOTE: FLIP_ANIMATION_DURATION is 500

    tile.addEventListener(
      "transitionend",
      () => {
        tile.classList.remove("flip");
        if (targetWord[index] === letter) {
          tile.dataset.state = "correct";
          key.classList.add("correct");
        } else if (targetWord.includes(letter)) {
          tile.dataset.state = "wrong-location";
          key.classList.add("wrong-location");
        } else {
          tile.dataset.state = "wrong";
          key.classList.add("wrong");
        }

        if (index === array.length - 1) {
          tile.addEventListener(
            "transitionend",
            () => {
              // startInteraction({ keyboard, guessGrid, alertContainer }); // wtf is going on here
              checkWinLose(guess, array);
            },
            { once: true },
          );
        }
      },
      { once: true },
    );
  }

  function getActiveTiles(guessGrid: RefObject<HTMLDivElement>) {
    return guessGrid.current?.querySelectorAll('[data-state="active"]');
  }

  function showAlert(message: any, duration: number | null = 1000) {
    const alert = document.createElement("div");
    alert.textContent = message;
    alert.classList.add("alert");
    alertContainerRef.current?.prepend(alert);
    if (duration == null) {
      return;
    }
    setTimeout(() => {
      alert.classList.add("hide");
      alert.addEventListener("transitionend", () => {
        alert.remove();
      });
    }, duration);
  }

  function shakeTiles(tiles: any) {
    tiles.forEach((tile: any) => {
      tile.classList.add("shake");
      tile.addEventListener(
        "animationend",
        () => {
          tile.classList.remove("shake");
        },
        { once: true },
      );
    });
  }

  function checkWinLose(guess: any, tiles: any) {
    if (guess === targetWord) {
      showAlert("You Win!!! 🎉🎉", 6000);
      danceTiles(tiles);
      stopInteraction();
      return;
    }

    const remainingTiles = guessGridRef.current?.querySelectorAll(
      ":not([data-letter])",
    );
    if (!remainingTiles) return;
    if (remainingTiles.length === 0) {
      showAlert("Correct word: " + targetWord.toUpperCase(), null);
      stopInteraction();
    }
  }
  function danceTiles(tiles: any) {
    tiles.forEach((tile: any, index: any) => {
      setTimeout(
        () => {
          tile.classList.add("dance");
          tile.addEventListener(
            "animationend",
            () => {
              tile.classList.remove("dance");
            },
            { once: true },
          );
        },
        (index * 500) / 5,
      ); // NOTE: DANCE_ANIMATION_DURATION is 500 here
    });
  }
}
