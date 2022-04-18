import { useQuery } from "react-query";
import { useLocation } from "react-router";
import {
  IGetMoviesResult,
  IGetTvsResult,
  searchMovies,
  searchTvs,
} from "../api";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Slider = styled.div<{ top: string }>`
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

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword") || "";

  const { data: dataMovies, isLoading: isLoadingMovies } =
    useQuery<IGetMoviesResult>(["search", "movie", keyword], () =>
      searchMovies(keyword)
    );
  const { data: dataTvs, isLoading: isLoadingTvs } = useQuery<IGetTvsResult>(
    ["search", "tv", keyword],
    () => searchTvs(keyword)
  );
  console.log(dataMovies);
  console.log(dataTvs);
  const [movieIndex, setMovieIndex] = useState(0);
  const [movieLeaving, setMovieLeaving] = useState(false);
  const changeMovieIndex = (amount: number) => {
    if (dataMovies) {
      if (movieLeaving) return;
      setMovieLeaving(true);
      const totalMovies = dataMovies?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setMovieIndex((prev) => {
        const newIndex = prev + amount;
        if (newIndex < 0) {
          return maxIndex;
        } else if (newIndex > maxIndex) {
          return 0;
        } else {
          return newIndex;
        }
      });
    }
  };
  const toggleMovieLeaving = () => setMovieLeaving((prev) => !prev);

  const [tvIndex, setTvIndex] = useState(0);
  const [tvLeaving, setTvLeaving] = useState(false);
  const changeTvIndex = (amount: number) => {
    if (dataTvs) {
      if (tvLeaving) return;
      setTvLeaving(true);
      const totalTvs = dataTvs?.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setTvIndex((prev) => {
        const newIndex = prev + amount;
        if (newIndex < 0) {
          return maxIndex;
        } else if (newIndex > maxIndex) {
          return 0;
        } else {
          return newIndex;
        }
      });
    }
  };
  const toggleTvLeaving = () => setTvLeaving((prev) => !prev);

  // Search
  return (
    <Wrapper>
      {isLoadingMovies ? (
        <Loader>Loading...</Loader>
      ) : (
        <Slider top="100px">
          <Title>Movies</Title>
          <AnimatePresence initial={false} onExitComplete={toggleMovieLeaving}>
            <Row
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 1 }}
              key={movieIndex}
            >
              <button onClick={() => changeMovieIndex(-1)}>🔙</button>
              {dataMovies?.results
                .slice(1)
                .slice(offset * movieIndex, offset * movieIndex + offset)
                .map((movie) => (
                  <Box
                    key={movie.id}
                    variants={boxVariants}
                    initial="normal"
                    whileHover="hover"
                    transition={{ type: "tween" }}
                    bgphoto={makeImagePath(
                      movie.backdrop_path
                        ? movie.backdrop_path
                        : movie.poster_path,
                      "w500"
                    )}
                    layoutId={movie.id + ""}
                  >
                    <Info variants={infoVariants}>
                      <h4>{movie.title}</h4>
                    </Info>
                  </Box>
                ))}
              <button onClick={() => changeMovieIndex(1)}>🔜</button>
            </Row>
          </AnimatePresence>
        </Slider>
      )}
      {isLoadingTvs ? (
        <Loader>Loading...</Loader>
      ) : (
        <Slider top="400px">
          <Title>Tv Shows</Title>
          <AnimatePresence initial={false} onExitComplete={toggleTvLeaving}>
            <Row
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 1 }}
              key={tvIndex}
            >
              <button onClick={() => changeTvIndex(-1)}>🔙</button>
              {dataTvs?.results
                .slice(1)
                .slice(offset * tvIndex, offset * tvIndex + offset)
                .map((tv) => (
                  <Box
                    key={tv.id}
                    variants={boxVariants}
                    initial="normal"
                    whileHover="hover"
                    transition={{ type: "tween" }}
                    bgphoto={makeImagePath(
                      tv.backdrop_path ? tv.backdrop_path : tv.poster_path,
                      "w500"
                    )}
                    layoutId={tv.id + ""}
                  >
                    <Info variants={infoVariants}>
                      <h4>{tv.name}</h4>
                    </Info>
                  </Box>
                ))}
              <button onClick={() => changeTvIndex(1)}>🔜</button>
            </Row>
          </AnimatePresence>
        </Slider>
      )}
    </Wrapper>
  );
}

export default Search;
