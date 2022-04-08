import { useQuery } from "react-query";
import { fetchCoinTickers } from "../api";
import styled from "styled-components";

interface PriceProps {
  coinId: string;
}
interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

const PriceInfoList = styled.ul``;

const PriceInfo = styled.li`
  display: grid;
  grid-template-columns: 1fr 1fr;
  span:nth-child(1) {
    text-align: right;
    margin-right: 10px;
  }
`;

function Price({ coinId }: PriceProps) {
  const { isLoading, data } = useQuery<PriceData>(["tickers", coinId], () =>
    fetchCoinTickers(coinId)
  );
  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <>
          <PriceInfoList>
            <PriceInfo>
              <span>역대 최고 가격 달성일</span>
              <span>{data?.quotes.USD.ath_date}</span>
            </PriceInfo>
            <PriceInfo>
              <span>최고 가격</span>
              <span>${data?.quotes.USD.ath_price.toFixed(3)}</span>
            </PriceInfo>
            <PriceInfo>
              <span>최고 가격 기준 등락율</span>
              <span>{data?.quotes.USD.percent_from_price_ath}%</span>
            </PriceInfo>
          </PriceInfoList>
          <hr />
          <PriceInfoList>
            <PriceInfo>
              <span>가격</span>
              <span>${data?.quotes.USD.price.toFixed(3)}</span>
            </PriceInfo>
            <PriceInfo>
              <span>최근 15분 등락율</span>
              <span>{data?.quotes.USD.percent_change_15m}%</span>
            </PriceInfo>
            <PriceInfo>
              <span>최근 30분 등락율</span>
              <span>{data?.quotes.USD.percent_change_30m}%</span>
            </PriceInfo>
            <PriceInfo>
              <span>최근 1시간 등락율</span>
              <span>{data?.quotes.USD.percent_change_1h}%</span>
            </PriceInfo>
            <PriceInfo>
              <span>최근 6시간 등락율</span>
              <span>{data?.quotes.USD.percent_change_6h}%</span>
            </PriceInfo>
            <PriceInfo>
              <span>최근 12시간 등락율</span>
              <span>{data?.quotes.USD.percent_change_12h}%</span>
            </PriceInfo>
            <PriceInfo>
              <span>최근 1일 등락율</span>
              <span>{data?.quotes.USD.percent_change_24h}%</span>
            </PriceInfo>
            <PriceInfo>
              <span>최근 일주일 등락율</span>
              <span>{data?.quotes.USD.percent_change_7d}%</span>
            </PriceInfo>
            <PriceInfo>
              <span>최근 한달 등락율</span>
              <span>{data?.quotes.USD.percent_change_30d}%</span>
            </PriceInfo>
            <PriceInfo>
              <span>최근 1년 등락율</span>
              <span>{data?.quotes.USD.percent_change_1y}%</span>
            </PriceInfo>
          </PriceInfoList>
        </>
      )}
    </div>
  );
}

export default Price;
