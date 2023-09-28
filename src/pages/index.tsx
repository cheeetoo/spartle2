import Keyboard from "@/components/Keyboard";
import { useEffect, useRef } from "react";

export default function Home() {
  const keyboardRef = useRef<HTMLDivElement>(null);
  const guessGridRef = useRef<HTMLDivElement>(null);
  const alertContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stopInteraction = startInteraction(guessGridRef);

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

function startInteraction(guessGrid: React.RefObject<HTMLDivElement>) {
  const handleClick = (e: Event) => handleMouseClick(e, guessGrid);
  const handleKey = (e: KeyboardEvent) => handleKeyPress(e, guessGrid);

  document.addEventListener("click", handleClick);
  document.addEventListener("keydown", handleKey);

  return () => {
    document.removeEventListener("click", handleClick);
    document.removeEventListener("keydown", handleKey);
  };
}

function handleMouseClick(e: any, guessGrid: React.RefObject<HTMLDivElement>) {
  if (e.target.matches("[data-key]")) {
    pressKey(e.target.dataset.key, guessGrid);
    return;
  }

  if (e.target.matches("[data-enter]")) {
    submitGuess(guessGrid);
    return;
  }

  if (e.target.matches("[data-delete]")) {
    deleteKey();
    return;
  }
}

function handleKeyPress(e: any, guessGrid: React.RefObject<HTMLDivElement>) {
  if (e.key === "Enter") {
    submitGuess(guessGrid);
    return;
  }

  if (e.key === "Backspace" || e.key === "Delete") {
    deleteKey();
    return;
  }

  if (e.key.match(/^[a-z]$/)) {
    pressKey(e.key, guessGrid);
    return;
  }
}

function pressKey(key: any, guessGrid: React.RefObject<HTMLDivElement>) {
  const activeTiles = getActiveTiles();
  if (activeTiles.length >= 5) {
    return;
  }
  const nextTile = guessGrid.current?.querySelector(":not([data-letter])") as HTMLDivElement;
  if (!nextTile) return;
  nextTile.dataset.letter = key.toLowerCase();
  nextTile.textContent = key;
  nextTile.dataset.state = "active";
}

function deleteKey() {
  const activeTiles = getActiveTiles();
  const lastTile = activeTiles[activeTiles.length - 1];
  if (!lastTile) return;
  lastTile.textContent = "";
  delete lastTile.dataset.state;
  delete lastTile.dataset.letter;
}

function submitGuess(guessGrid: React.RefObject<HTMLDivElement>) {
  const activeTiles = [...getActiveTiles()];
  if (activeTiles.length !== 5) {
    showAlert("Not enough letters!");
    shakeTiles(activeTiles);
    return;
  }

  const guess = activeTiles.reduce((word, tile) => {
    return word + tile.dataset.letter;
  }, "");
  if (!dictionary.includes(guess)) {
    showAlert("Not in word list");
    shakeTiles(activeTiles);
    return;
  }

  stopInteraction(guessGrid);
  activeTiles.forEach((...params) => flipTile(...params, guess, guessGrid));
}

function flipTile(tile: any, index: any, array: any, guess: any, guessGrid: React.RefObject<HTMLDivElement>) {
  const letter = tile.dataset.letter;
  const key = keyboard.querySelector(`[data-key="${letter}"i]`);
  setTimeout(() => {
    tile.classList.add("flip");
  }, (index * 500) / 2); // NOTE: FLIP_ANIMATION_DURATION is 500

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
            startInteraction(guessGrid);
            checkWinLose(guess, array, guessGrid);
          },
          { once: true }
        );
      }
    },
    { once: true }
  );
}

function getActiveTiles() {
  return guessGrid.querySelectorAll('[data-state="active"]');
}

function showAlert(message: any, duration = 1000) {
  const alert = document.createElement("div");
  alert.textContent = message;
  alert.classList.add("alert");
  alertContainer.prepend(alert);
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
      { once: true }
    );
  });
}

function checkWinLose(guess: any, tiles: any, guessGrid: React.RefObject<HTMLDivElement>) {
  if (guess === targetWord) {
    showAlert("You Win!!! 🎉🎉", 6000);
    danceTiles(tiles);
    stopInteraction(guessGrid);
    return;
  }

  const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])");
  if (remainingTiles.length === 0) {
    showAlert("Correct word: " + targetWord.toUpperCase(), null);
    stopInteraction(guessGrid);
  }
}
function danceTiles(tiles: any) {
  tiles.forEach((tile: any, index: any) => {
    setTimeout(() => {
      tile.classList.add("dance");
      tile.addEventListener(
        "animationend",
        () => {
          tile.classList.remove("dance");
        },
        { once: true }
      );
    }, (index * 500) / 5); // NOTE: DANCE_ANIMATION_DURATION is 500 here
  });
}
