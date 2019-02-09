import { render } from "react-dom";
import React, { useState } from "react";
import { useSpring, animated as a } from "react-spring";
import "./styles.css";
import styled from "styled-components";

const StyledCards = styled.div`
  max-width: 800px;
  display: flex;
  margin: 0 auto;
  flex-wrap: wrap;
  align-content: center;
`;

const StyledCard = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  margin: 10px;

  @media (min-width: 400px) {
    width: 150px;
    height: 150px;
    margin: 20px;
  }
`;

const cardStrings = [
  "delfin",
  "bat",
  "pus",
  "giraff",
  "rev",
  "elefant",
  "gris",
  "zebra"
];

function Shuffle(o) {
  // thanks, internet!
  for (
    var j, x, i = o.length;
    i;
    j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x
  );
  return o;
}

function doubleList(inp) {
  return inp.reduce((sum, next) => {
    sum.push(next);
    sum.push(next);
    return sum;
  }, []);
}

function appendOtherMovie(list) {
  return list.map((card1, index1) => {
    let otherIndex = -1;

    list.forEach((card2, index2) => {
      if (index1 !== index2 && card1.name === card2.name) {
        otherIndex = index2;
      }
    });

    return {
      ...card1,
      otherIndex
    };
  });
}

function Cards() {
  const [flippedCards, setFlippedCards] = useState(0);

  const shuffledList = appendOtherMovie(
    Shuffle(
      doubleList(
        cardStrings.map(name => ({ name, flipped: false, solved: false }))
      )
    )
  );

  const [cards, setCards] = useState(shuffledList);

  const handleFlip = indexOfCardClicked => {
    const thisCard = cards[indexOfCardClicked];
    const otherCard = cards[thisCard.otherIndex];

    // First click or first click after solving
    // hide all !solved and flipped
    // show the selected one
    if (flippedCards === 0) {
      setCards(
        cards.map((card, index) => {
          if (index === indexOfCardClicked) {
            return { ...card, flipped: true };
          }

          return !card.solved && card.flipped
            ? { ...card, flipped: false }
            : card;
        })
      );
    } else {
      //Second click
      // if solved - mark solved
      // if not - do nothing!
      if (otherCard.flipped) {
        setCards(
          cards.map((card, index) =>
            card.name === thisCard.name
              ? { ...card, flipped: true, solved: true }
              : card
          )
        );
      } else {
        setCards(
          cards.map((card, index) =>
            index === indexOfCardClicked ? { ...card, flipped: true } : card
          )
        );
      }
    }

    setFlippedCards((flippedCards + 1) % 2);
  };

  return (
    <>
      <StyledCards>
        {cards.map((el, index) => (
          <Card
            key={index}
            index={index}
            image={el.name}
            flipped={el.flipped}
            handleFlip={handleFlip}
          />
        ))}
      </StyledCards>
    </>
  );
}

function Card({ image, index, flipped, handleFlip }) {
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 }
  });
  return (
    <StyledCard>
      <a.div
        onClick={() => {
          handleFlip(index);
        }}
        className="c back"
        style={{ opacity: opacity.interpolate(o => 1 - o), transform }}
      />
      <a.div
        onClick={() => {
          handleFlip(index);
        }}
        className="c front"
        style={{
          opacity,
          transform: transform.interpolate(t => `${t} rotateY(180deg)`),
          backgroundImage: `url('./${image}.jpg')`
        }}
      />
    </StyledCard>
  );
}

render(<Cards />, document.getElementById("root"));
