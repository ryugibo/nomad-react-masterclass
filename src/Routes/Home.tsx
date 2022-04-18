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
  getMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  IGetMoviesResult,
  IMovie,
} from "../api";
import { makeImagePath } from "../utils";
import Slider from "../Components/Slider";

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

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const { scrollY } = useViewportScroll();
  const setScrollY = useTransform(scrollY, (value) => value + 50);
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const { data: dataTopRated, isLoading: isLoadingTopRated } =
    useQuery<IGetMoviesResult>(["movies", "topRated"], getTopRatedMovies);
  const { data: dataUpcoming, isLoading: isLoadingUpcoming } =
    useQuery<IGetMoviesResult>(["movied", "upcoming"], getUpcomingMovies);
  console.log(dataTopRated);
  const onClickedBox = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };
  const onClickedOverlay = () => {
    history.push(`/`);
  };
  const findMovie = (movie: IMovie) => {
    return movie.id + "" === bigMovieMatch?.params.movieId;
  };

  let clickedType = "";
  let clickedMovie = undefined;
  if (data?.results.find(findMovie)) {
    clickedMovie = data?.results.find(findMovie);
    clickedType = "latest_movies";
  } else if (dataTopRated?.results.find(findMovie)) {
    clickedMovie = dataTopRated?.results.find(findMovie);
    clickedType = "top_rated";
  } else if (dataUpcoming?.results.find(findMovie)) {
    clickedMovie = dataUpcoming?.results.find(findMovie);
    clickedType = "upcoming";
  }
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider
            layoutPrefix="latest_movies"
            title="Latest movies"
            top="-100px"
            datas={data ? data.results : []}
            onClickedBox={onClickedBox}
          />
          <AnimatePresence>
            {bigMovieMatch && (
              <>
                <Overlay
                  onClick={onClickedOverlay}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: setScrollY }}
                  layoutId={clickedType + bigMovieMatch.params.movieId}
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
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            )}
          </AnimatePresence>
        </>
      )}
      {isLoadingTopRated ? (
        <Loader>Loading...</Loader>
      ) : (
        <Slider
          layoutPrefix="top_rated"
          title="Top Rated Movies"
          top="200px"
          datas={dataTopRated ? dataTopRated.results : []}
          onClickedBox={onClickedBox}
        />
      )}
      {isLoadingUpcoming ? (
        <Loader>Loading...</Loader>
      ) : (
        <Slider
          layoutPrefix="upcoming"
          title="Upcoming Movies"
          top="500px"
          datas={dataUpcoming ? dataUpcoming.results : []}
          onClickedBox={onClickedBox}
        />
      )}
    </Wrapper>
  );
}

export default Home;
