import Script from "next/script";
import Keyboard from "@/components/Keyboard";

export default function Home() {
  return (
    <>
      <Script src="/script.js"></Script>
      <header className="text-white flex justify-center text-4xl font-bold border-b-2 w-full overflow-hidden p-4 mb-4 border-[#39393c] font-sans">
        Spartle
      </header>
      <main>
        <div className="alert-container" data-alert-container></div>
        <div data-guess-grid className="guess-grid">
          {Array.from({ length: 30 }).map((_, index) => (
            <div className="tile" key={index}></div>
          ))}
        </div>
        <Keyboard />
      </main>
    </>
  );
}
