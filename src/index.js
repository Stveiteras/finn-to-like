import { render } from "react-dom";
import React, { useState } from "react";
import { useSpring, animated as a } from "react-spring";
import "./styles.css";
import styled from "styled-components";

const StyledWrapper = styled.div`
  max-width: 800px;
  text-align: center;
  font-family: "Palatino Linotype", "Book Antiqua", Palatino, serif;
`;

const StyledHeader = styled.h1`
  font-size: 30px;
  text-transform: uppercase;
`;

const StyledCards = styled.div`
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

function FirstCardFlipped(flippedCards) {
  return flippedCards === 0;
}

function PairSolved(otherCard) {
  return otherCard.flipped;
}

const initialCardState = appendOtherMovie(
  Shuffle(
    doubleList(
      cardStrings.map(name => ({ name, flipped: false, solved: false }))
    )
  )
);
function Cards() {
  const [flippedCards, setFlippedCards] = useState(0);
  const [cards, setCards] = useState(initialCardState);
  const [solvedCards, setSolvedCards] = useState(0);

  const handleFlip = indexOfCardClicked => {
    const thisCard = cards[indexOfCardClicked];
    const otherCard = cards[thisCard.otherIndex];

    // some named function to be invoked
    const flipCurrentCardButKeepSolved = (card, index) => {
      if (index === indexOfCardClicked) {
        return { ...card, flipped: true };
      }

      return !card.solved && card.flipped ? { ...card, flipped: false } : card;
    };

    const markPairSolved = (card, index) =>
      card.name === thisCard.name
        ? { ...card, flipped: true, solved: true }
        : card;

    const flipClickedCard = (card, index) =>
      index === indexOfCardClicked ? { ...card, flipped: true } : card;

    // Where the magic happens
    if (FirstCardFlipped(flippedCards)) {
      setCards(cards.map(flipCurrentCardButKeepSolved));
    } else {
      // This means second click
      if (PairSolved(otherCard)) {
        setCards(cards.map(markPairSolved));
        setSolvedCards(solvedCards + 1);
      } else {
        setCards(cards.map(flipClickedCard));
      }
    }

    setFlippedCards((flippedCards + 1) % 2);
  };

  return (
    <StyledWrapper>
      <StyledHeader>Finn to like</StyledHeader>

      {solvedCards === cards.length / 2 && <p>Du klarte det! Gratulerer!</p>}
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
    </StyledWrapper>
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
