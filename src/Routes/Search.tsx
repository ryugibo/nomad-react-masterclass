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

  // Search
  return (
    <Wrapper>
      {isLoadingMovies ? (
        <Loader>Loading...</Loader>
      ) : (
        <Slider
          title="Movies"
          top="100px"
          datas={dataMovies ? dataMovies.results : []}
        />
      )}
      {isLoadingTvs ? (
        <Loader>Loading...</Loader>
      ) : (
        <Slider
          title="Tv Shows"
          top="400px"
          datas={dataTvs ? dataTvs.results : []}
        />
      )}
    </Wrapper>
  );
}

export default Search;
