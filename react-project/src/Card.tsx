import * as React from "react";
import { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import gsap from "gsap";
import Draggable from "gsap/Draggable";
import { API_URL } from "./constants";
import { ClipCard } from "./App";
gsap.registerPlugin(Draggable);

export function Card({
  removeCard,
  data,
  id,
}: {
  removeCard: (id: any) => void;
  data: ClipCard;
  id: any;
}) {
  const hasRun = React.useRef(false);
  const [img, setImg] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const enableDrag = () => {
    Draggable.create(".card", {
      bounds: ".App",
      type: "x,y",
    });
  };

  useEffect(() => {
    enableDrag();
  }, []);

  useEffect(() => {
    if (data?.url && !hasRun.current) {
      hasRun.current = true;
      try {
        fetch(`${API_URL}/screenshot?url=${data.url}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "any",
          },
        })
          .then(async (res) => {
            let _data = await res.json();
            console.log(_data?.img?.length);
            if (_data && _data.img) {
              setImg(_data.img);
            }
          })
          .catch((e) => {
            hasRun.current = false;
            setImg("");
          });
      } catch (e) {
        hasRun.current = false;
        setImg("");
      }
    }
  }, [data]);

  return (
    <div className="card">
      <IoCloseSharp
        onClick={() => removeCard(id)}
        color="black"
        size="24"
        style={{
          right: "4px",
          top: "4px",
          position: "absolute",
          cursor: "pointer",
          border: error ? "1px solid red" : "1px solid black",
        }}
      />

      {img && (
        <img
          src={`data:image/png;base64,${img}`}
          style={{
            objectFit: "cover",
            width: "100%",
            height: "auto",
            overflow: "hidden",
            minWidth: "300px",
            maxWidth: "500px",
          }}
        />
      )}
      {!img && <span className="loader"></span>}
    </div>
  );
}
