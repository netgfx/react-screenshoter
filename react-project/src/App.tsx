import { useEffect, useState } from "react";
import "./styles.css";

import { Card } from "./Card";

export interface ClipCard {
  img: string | null;
  url: string;
  id: number;
}

export default function App() {
  const [cards, setCards] = useState<any[]>([]);

  const onPaste = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === "v") {
      console.log("Ctrl+V was pressed");
      let clipboard = navigator.clipboard.readText();

      clipboard.then((text) => {
        if (text.indexOf("https://") !== -1) {
          setCards((cards: ClipCard[]) => [
            ...cards,
            { img: null, url: text, id: Date.now() },
          ]);
        }
      });
    }
  };

  const removeCard = (id: any) => {
    setCards((cards) => cards.filter((card) => card.id !== id));
  };

  useEffect(() => {
    document.addEventListener("keydown", onPaste);

    return () => {
      document.removeEventListener("keydown", onPaste);
    };
  }, []);

  return (
    <div className="App">
      {cards.map((card, index) => (
        <Card key={index} id={card.id} data={card} removeCard={removeCard} />
      ))}

      <p
        style={{
          fontSize: "18px",
          lineHeight: "24px",
          backgroundColor: "white",
          padding: "8px",
        }}
      >
        <strong>Ctrl/Cmd + v</strong> a URL (e.g: https://google.com)
        <br />
        (cards are draggable!)
      </p>
    </div>
  );
}
