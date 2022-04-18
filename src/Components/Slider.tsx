import { useQuery } from "react-query";
import { useLocation } from "react-router";
import {
  IGetMoviesResult,
  IGetTvsResult,
  IMovie,
  ITv,
  searchMovies,
  searchTvs,
} from "../api";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { MouseEventHandler, useState } from "react";
import { makeImagePath } from "../utils";

const SliderWrapper = styled.div<{ top: string }>`
  position: relative;
  top: ${(props) => props.top};
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: 30px repeat(6, 1fr) 30px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  position: relative;
  background-color: white;
  height: 200px;
  font-size: 26px;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const rowVariants = {
  hidden: { x: window.outerWidth + 5 },
  visible: { x: 0 },
  exit: { x: -window.outerWidth - 5 },
};
const infoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.5, duration: 0.3, type: "tween" },
  },
};
const boxVariants = {
  normal: { originX: 0, scale: 1 },
  hover: {
    scale: 1.3,
    y: -50,
    transition: { delay: 0.5, duration: 0.3, type: "tween" },
  },
};
const offset = 6;

interface ISlider {
  layoutPrefix?: string;
  title: string;
  top: string;
  datas: IMovie[] | ITv[] | [];
  onClickedBox?: (key: number) => any;
}

function Slider({ layoutPrefix, title, top, datas, onClickedBox }: ISlider) {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const changeIndex = (amount: number) => {
    if (leaving) {
      return;
    }
    setLeaving(true);
    const total = datas.length - 1;
    const maxIndex = Math.floor(total / offset) - 1;
    setIndex((prev) => {
      const newIndex = prev + amount;
      if (newIndex < 0) {
        return maxIndex;
      } else if (newIndex > maxIndex) {
        return 0;
      } else {
        return newIndex;
      }
    });
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);

  return (
    <SliderWrapper top={top}>
      <Title>{title}</Title>
      <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
        <Row
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 1 }}
          key={index}
        >
          <button onClick={() => changeIndex(-1)}>🔙</button>
          {datas
            .slice(1)
            .slice(offset * index, offset * index + offset)
            .map((movie) => (
              <Box
                key={movie.id}
                variants={boxVariants}
                initial="normal"
                whileHover="hover"
                transition={{ type: "tween" }}
                bgphoto={makeImagePath(
                  movie.backdrop_path ? movie.backdrop_path : movie.poster_path,
                  "w500"
                )}
                onClick={() => {
                  if (onClickedBox) {
                    onClickedBox(movie.id);
                  }
                }}
                layoutId={(layoutPrefix || "") + movie.id}
              >
                <Info variants={infoVariants}>
                  <h4>
                    {(movie as IMovie) && (movie as IMovie).title}
                    {(movie as ITv) && (movie as ITv).name}
                  </h4>
                </Info>
              </Box>
            ))}
          <button onClick={() => changeIndex(1)}>🔜</button>
        </Row>
      </AnimatePresence>
    </SliderWrapper>
  );
}

export default Slider;
