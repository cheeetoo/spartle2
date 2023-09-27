import Script from "next/script";
import Keyboard from "@/components/Keyboard";
import { useRef } from "react";

export default function Home() {
  const keyboardRef = useRef<HTMLDivElement>(null);
  const guessGridRef = useRef<HTMLDivElement>(null);
  const alertContainerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Script src="/script.js"></Script>
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
