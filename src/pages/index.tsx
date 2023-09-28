import InformationBox from "@/components/InformationBox";
import Keyboard from "@/components/Keyboard";
import { useEffect, useRef, RefObject } from "react";

export default function Home() {
  const keyboardRef = useRef<HTMLDivElement>(null);
  const guessGridRef = useRef<HTMLDivElement>(null);
  const alertContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    stopInteraction = startInteraction({
      keyboard: keyboardRef,
      guessGrid: guessGridRef,
      alertContainer: alertContainerRef,
    });
    const getData = async () => {
      const dictText = await (await fetch("/words")).text();
      dictionary = dictText.split("\n");
      const wordText = await (await fetch("/api/word")).json();
      targetWord = wordText.word;
    };
    getData();

    return () => {
      stopInteraction();
    };
  }, []);

  return (
    <>
      <header className="text-white flex justify-center text-4xl font-bold border-b-2 w-full overflow-hidden p-4 mb-4 border-[#39393c] font-sans">
        Spartle
      </header>
      <main>
        <InformationBox />
        <div className="alert-container" ref={alertContainerRef}></div>
        <div className="guess-grid" ref={guessGridRef}>
          {Array.from({ length: 30 }).map((_, index) => (
            <div className="tile" key={index}></div>
          ))}
        </div>
        <Keyboard ref={keyboardRef} />
      </main>
    </>
  );
}

let stopInteraction: () => void;
let dictionary: string[];
let targetWord: string;

interface Refs {
  keyboard: RefObject<HTMLDivElement>;
  guessGrid: RefObject<HTMLDivElement>;
  alertContainer: RefObject<HTMLDivElement>;
}

function startInteraction({ keyboard, guessGrid, alertContainer }: Refs) {
  const handleClick = (e: Event) =>
    handleMouseClick(e, { keyboard, guessGrid, alertContainer });
  const handleKey = (e: KeyboardEvent) =>
    handleKeyPress(e, { keyboard, guessGrid, alertContainer });

  document.addEventListener("click", handleClick);
  document.addEventListener("keydown", handleKey);

  return () => {
    document.removeEventListener("click", handleClick);
    document.removeEventListener("keydown", handleKey);
  };
}

function handleMouseClick(
  e: any,
  { keyboard, guessGrid, alertContainer }: Refs,
) {
  if (e.target.matches("[data-key]")) {
    pressKey(e.target.dataset.key, guessGrid);
    return;
  }

  if (e.target.matches("[data-enter]")) {
    submitGuess({ keyboard, guessGrid, alertContainer });
    return;
  }

  if (e.target.matches("[data-delete]")) {
    deleteKey(guessGrid);
    return;
  }
}

function handleKeyPress(e: any, { keyboard, guessGrid, alertContainer }: Refs) {
  if (e.key === "Enter") {
    submitGuess({ keyboard, guessGrid, alertContainer });
    return;
  }

  if (e.key === "Backspace" || e.key === "Delete") {
    deleteKey(guessGrid);
    return;
  }

  if (e.key.match(/^[a-z]$/)) {
    pressKey(e.key, guessGrid);
    return;
  }
}

function pressKey(key: any, guessGrid: RefObject<HTMLDivElement>) {
  const activeTiles = getActiveTiles(guessGrid) ?? [];
  if (activeTiles.length >= 5) {
    return;
  }
  const nextTile = guessGrid.current?.querySelector(
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

function deleteKey(guessGrid: RefObject<HTMLDivElement>) {
  const activeTiles = getActiveTiles(guessGrid);
  if (!activeTiles) return;
  const lastTile = activeTiles[activeTiles.length - 1] as HTMLElement;
  if (!lastTile) return;
  lastTile.textContent = "";
  delete lastTile.dataset.state;
  delete lastTile.dataset.letter;
}

function submitGuess({ keyboard, guessGrid, alertContainer }: Refs) {
  const activeTiles = Array.from(getActiveTiles(guessGrid) ?? []);
  if (activeTiles.length !== 5) {
    showAlert("Not enough letters!", 1000, alertContainer);
    shakeTiles(activeTiles);
    return;
  }

  const guess = activeTiles.reduce((word, tile) => {
    return word + (tile as HTMLDivElement).dataset.letter;
  }, "");
  if (!dictionary.includes(guess)) {
    showAlert("Not in word list", 1000, alertContainer);
    shakeTiles(activeTiles);
    return;
  }

  activeTiles.forEach((...params) =>
    flipTile(...params, guess, keyboard, guessGrid, alertContainer),
  );
}

function flipTile(
  tile: any,
  index: any,
  array: any,
  guess: any,
  keyboard: RefObject<HTMLDivElement>,
  guessGrid: RefObject<HTMLDivElement>,
  alertContainer: RefObject<HTMLDivElement>,
) {
  const letter = tile.dataset.letter;
  const key = keyboard.current?.querySelector(`[data-key="${letter}"i]`);
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
            checkWinLose(guess, array, guessGrid, alertContainer);
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

function showAlert(
  message: any,
  duration: number | null = 1000,
  alertContainer: RefObject<HTMLDivElement>,
) {
  const alert = document.createElement("div");
  alert.textContent = message;
  alert.classList.add("alert");
  alertContainer.current?.prepend(alert);
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

function checkWinLose(
  guess: any,
  tiles: any,
  guessGrid: RefObject<HTMLDivElement>,
  alertContainer: RefObject<HTMLDivElement>,
) {
  if (guess === targetWord) {
    showAlert("You Win!!! 🎉🎉", 6000, alertContainer);
    danceTiles(tiles);
    stopInteraction();
    return;
  }

  const remainingTiles = guessGrid.current?.querySelectorAll(
    ":not([data-letter])",
  );
  if (!remainingTiles) return;
  if (remainingTiles.length === 0) {
    showAlert(
      "Correct word: " + targetWord.toUpperCase(),
      null,
      alertContainer,
    );
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
