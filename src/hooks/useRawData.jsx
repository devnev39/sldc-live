import { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { NavbarContext } from "../context/navbarContext";
import api from "../query/query";
import { clearData, filterData, parseData } from "../features/data";
import dayjs from "dayjs";

const CACHE_MIN = import.meta.env.VITE_CAHCE_MIN;

export default function useRawData() {
  const { date } = useContext(NavbarContext);
  const dispatch = useDispatch();
  useEffect(() => {
    // This useffect is used for :
    // Fetch the data
    // Parse the data
    // Filter the data
    if (import.meta.env.VITE_APPMODE !== "DEBUG") {
      const rawData = localStorage.getItem(date.format("YYYY-MM-DD"));
      if (rawData) {
        let data = JSON.parse(rawData);
        const diff = dayjs().diff(dayjs(data.createdAtTs * 1000), "minute");
        if (diff < CACHE_MIN) {
          dispatch(clearData());
          dispatch(parseData(data.docs));
          dispatch(filterData());
          console.log("Loaded raw data from cache!");
          return;
        }
      }
      api
        .getDateData(date.format("YYYY-MM-DD"))
        .then((docs) => {
          dispatch(clearData());
          const data = { docs: docs, createdAtTs: dayjs().unix() };
          localStorage.setItem(date.format("YYYY-MM-DD"), JSON.stringify(data));
          dispatch(parseData(docs));
          dispatch(filterData());
        })
        .catch((err) => {
          console.log(err);
        });
    }
    return () => {
      dispatch(clearData());
    };
  }, [date, dispatch]);
}
