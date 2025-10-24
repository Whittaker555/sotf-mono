"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const headerText = "survival of the fittest";
  const [displayedText, setDisplayedText] = useState("");
  const [extraText, setExtraText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    let time = 0;
    const interval = setInterval(() => {
      setExtraText((prev) => (prev === "" ? "|" : ""));
      if (time < 5) {
        time++;
        return;
      } else if (currentIndex < headerText.length) {
        setDisplayedText(headerText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setExtraText("");
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [headerText]);

  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-6xl tracking-wide">
        {displayedText} {extraText}
      </h1>
    </div>
  );
}
