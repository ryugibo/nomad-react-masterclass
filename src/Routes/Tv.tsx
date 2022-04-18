import {
  AnimatePresence,
  motion,
  useTransform,
  useViewportScroll,
} from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import {
  getTvs,
  getTvsAiringToday,
  getTvsPopular,
  getTvsTopRated,
  IGetTvsResult,
  ITv,
} from "../api";
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

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(
      rgba(0, 0, 0, 1),
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 1)
    ),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50vw;
`;

const Slider = styled.div<{ top: string }>`
  position: relative;
  top: ${(props) => props.top};
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
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

const Overlay = styled(motion.div)`
  position: fixed;
  top 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 1;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
  z-index: 2;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 500px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  top: -80px;
`;

const rowVariants = {
  hidden: { x: window.outerWidth + 5 },
  visible: { x: 0 },
  exit: { x: -window.outerWidth - 5 },
};

const boxVariants = {
  normal: { originX: 0, scale: 1 },
  hover: {
    scale: 1.3,
    y: -50,
    transition: { delay: 0.5, duration: 0.3, type: "tween" },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.5, duration: 0.3, type: "tween" },
  },
};
const offset = 6;

function Tv() {
  const history = useHistory();
  const bigTvMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");
  const { scrollY } = useViewportScroll();
  const setScrollY = useTransform(scrollY, (value) => value + 50);
  const { data, isLoading } = useQuery<IGetTvsResult>(
    ["tv", "on_the_air"],
    getTvs
  );
  console.log(data);
  const { data: dataAiringToday, isLoading: isLoadingAiringToday } =
    useQuery<IGetTvsResult>(["tv", "airing_today"], getTvsAiringToday);
  const { data: dataPopular, isLoading: isLoadingPopular } =
    useQuery<IGetTvsResult>(["tv", "popular"], getTvsPopular);
  const { data: dataTopRated, isLoading: isLoadingTopRated } =
    useQuery<IGetTvsResult>(["tv", "top_rated"], getTvsTopRated);

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onClickedBox = (tvId: number) => {
    history.push(`/tv/${tvId}`);
  };
  const onClickedOverlay = () => {
    history.push(`/tv`);
  };
  const findTv = (movie: ITv) => {
    return movie.id + "" === bigTvMatch?.params.tvId;
  };
  const clickedMovie =
    bigTvMatch?.params.tvId &&
    (data?.results.find(findTv) ||
      dataAiringToday?.results.find(findTv) ||
      dataPopular?.results.find(findTv) ||
      dataTopRated?.results.find(findTv));
  console.log(clickedMovie);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].name}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider top="-100px">
            <Title>Latest Shows</Title>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      key={movie.id}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                      onClick={() => {
                        onClickedBox(movie.id);
                      }}
                      layoutId={movie.id + ""}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigTvMatch && (
              <>
                <Overlay
                  onClick={onClickedOverlay}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: setScrollY }}
                  layoutId={bigTvMatch.params.tvId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(
                            ${makeImagePath(clickedMovie.backdrop_path, "w500")}
                          )`,
                        }}
                      />
                      <BigTitle>{clickedMovie.name}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            )}
          </AnimatePresence>
        </>
      )}
      {isLoadingAiringToday ? (
        <Loader>Loading...</Loader>
      ) : (
        <Slider top="200px">
          <Title>Airing Today</Title>
          <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
            <Row
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 1 }}
              key={index}
            >
              {dataAiringToday?.results
                .slice(1)
                .slice(offset * index, offset * index + offset)
                .map((movie) => (
                  <Box
                    key={movie.id}
                    variants={boxVariants}
                    initial="normal"
                    whileHover="hover"
                    transition={{ type: "tween" }}
                    bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                    onClick={() => {
                      onClickedBox(movie.id);
                    }}
                    layoutId={movie.id + ""}
                  >
                    <Info variants={infoVariants}>
                      <h4>{movie.name}</h4>
                    </Info>
                  </Box>
                ))}
            </Row>
          </AnimatePresence>
        </Slider>
      )}
      {isLoadingPopular ? (
        <Loader>Loading...</Loader>
      ) : (
        <Slider top="500px">
          <Title>Popular</Title>
          <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
            <Row
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 1 }}
              key={index}
            >
              {dataPopular?.results
                .slice(1)
                .slice(offset * index, offset * index + offset)
                .map((tv) => (
                  <Box
                    key={tv.id}
                    variants={boxVariants}
                    initial="normal"
                    whileHover="hover"
                    transition={{ type: "tween" }}
                    bgphoto={makeImagePath(tv.backdrop_path, "w500")}
                    onClick={() => {
                      onClickedBox(tv.id);
                    }}
                    layoutId={tv.id + ""}
                  >
                    <Info variants={infoVariants}>
                      <h4>{tv.name}</h4>
                    </Info>
                  </Box>
                ))}
            </Row>
          </AnimatePresence>
        </Slider>
      )}
      {isLoadingTopRated ? (
        <Loader>Loading...</Loader>
      ) : (
        <Slider top="800px">
          <Title>Top Rated</Title>
          <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
            <Row
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 1 }}
              key={index}
            >
              {dataTopRated?.results
                .slice(1)
                .slice(offset * index, offset * index + offset)
                .map((tv) => (
                  <Box
                    key={tv.id}
                    variants={boxVariants}
                    initial="normal"
                    whileHover="hover"
                    transition={{ type: "tween" }}
                    bgphoto={makeImagePath(tv.backdrop_path, "w500")}
                    onClick={() => {
                      onClickedBox(tv.id);
                    }}
                    layoutId={tv.id + ""}
                  >
                    <Info variants={infoVariants}>
                      <h4>{tv.name}</h4>
                    </Info>
                  </Box>
                ))}
            </Row>
          </AnimatePresence>
        </Slider>
      )}
    </Wrapper>
  );
}

export default Tv;
