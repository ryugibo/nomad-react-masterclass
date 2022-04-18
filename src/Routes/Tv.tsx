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
  const { data: dataAiringToday, isLoading: isLoadingAiringToday } =
    useQuery<IGetTvsResult>(["tv", "airing_today"], getTvsAiringToday);
  const { data: dataPopular, isLoading: isLoadingPopular } =
    useQuery<IGetTvsResult>(["tv", "popular"], getTvsPopular);
  const { data: dataTopRated, isLoading: isLoadingTopRated } =
    useQuery<IGetTvsResult>(["tv", "top_rated"], getTvsTopRated);

  const onClickedBox = (tvId: number) => {
    history.push(`/tv/${tvId}`);
  };
  const onClickedOverlay = () => {
    history.push(`/tv`);
  };
  const findTv = (tv: ITv) => {
    return tv.id + "" === bigTvMatch?.params.tvId;
  };
  let clickedType = "";
  let clickedTv = undefined;
  if (data?.results.find(findTv)) {
    clickedTv = data?.results.find(findTv);
    clickedType = "latest_shows";
  } else if (dataAiringToday?.results.find(findTv)) {
    clickedTv = dataAiringToday?.results.find(findTv);
    clickedType = "airing_today";
  } else if (dataPopular?.results.find(findTv)) {
    clickedTv = dataPopular?.results.find(findTv);
    clickedType = "popular";
  } else if (dataTopRated?.results.find(findTv)) {
    clickedTv = dataTopRated?.results.find(findTv);
    clickedType = "top_rated";
  }
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].name}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider
            layoutPrefix="latest_shows"
            title="Latest Shows"
            top="-100px"
            datas={data ? data.results : []}
            onClickedBox={onClickedBox}
          />
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
                  layoutId={clickedType + bigTvMatch.params.tvId}
                >
                  {clickedTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(
                            ${makeImagePath(clickedTv.backdrop_path, "w500")}
                          )`,
                        }}
                      />
                      <BigTitle>{clickedTv.name}</BigTitle>
                      <BigOverview>{clickedTv.overview}</BigOverview>
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
        <Slider
          layoutPrefix="airing_today"
          title="Airing Today"
          top="200px"
          datas={dataAiringToday ? dataAiringToday.results : []}
          onClickedBox={onClickedBox}
        />
      )}
      {isLoadingPopular ? (
        <Loader>Loading...</Loader>
      ) : (
        <Slider
          layoutPrefix="popular"
          title="Popular"
          top="500px"
          datas={dataPopular ? dataPopular.results : []}
          onClickedBox={onClickedBox}
        />
      )}
      {isLoadingTopRated ? (
        <Loader>Loading...</Loader>
      ) : (
        <Slider
          layoutPrefix="top_rated"
          title="Top Rated"
          top="800px"
          datas={dataTopRated ? dataTopRated.results : []}
          onClickedBox={onClickedBox}
        />
      )}
    </Wrapper>
  );
}

export default Tv;
