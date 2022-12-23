import React, { useState, useEffect } from "react";
import "../styling/Board.css";

const BoardComponent = (props) => {
  const { b, move } = props;
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [clicked, setClicked] = useState(false);

  const handleMove = (e) => {
    if (
      !clicked &&
      b.simpleCopy()[parseInt(e.target.getAttribute("row"))][
        parseInt(e.target.getAttribute("col"))
      ][0] == "-" //bad hard coding the empty string. sholdnt even use strings in the first place
    ) {
      console.log("no piece is there");
      return;
    }
    if (!clicked) {
      setFrom([
        parseInt(e.target.getAttribute("row")),
        parseInt(e.target.getAttribute("col")),
      ]);
      setClicked(true);
    } else {
      setTo([
        parseInt(e.target.getAttribute("row")),
        parseInt(e.target.getAttribute("col")),
      ]);
      setClicked(false);
    }
  };

  useEffect(() => {
    if (from == null || to == null) {
      return;
    }
    move(from, to);
  }, [to]);

  const determineColour = (pos) => {
    if (b.getPiece(pos) != null) {
      if (b.getPiece(pos).colour) {
        return "w";
      }
      return "b";
    } else {
      if ((pos[0] + pos[1]) % 2 == 0) {
        return "w";
      } else {
        return "b";
      }
    }
  };

  const test = () => {
    console.log(b.moves);
  };

  return (
    <div>
      <table>
        <tbody>
          {b.simpleCopy().map((item, i) => (
            <tr key={i}>
              {item.map((item2, j) => (
                <td key={j}>
                  <div
                    className={determineColour([i, j])}
                    row={i}
                    col={j}
                    onClick={handleMove}
                    key={j}
                  >
                    {item2}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={test}>testing</button>
    </div>
  );
};

export default BoardComponent;
