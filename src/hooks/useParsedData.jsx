import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearDataFrame, createDataFrame } from "../features/data";
// import { Timestamp } from "firebase/firestore";
import api from "../query/query";
import dayjs from "dayjs";

const CACHE_MIN = import.meta.env.VITE_CAHCE_MIN;

export default function useParsedData() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (import.meta.env.VITE_APPMODE !== "DEBUG") {
      let data = localStorage.getItem("parsedData");
      if (data) {
        data = JSON.parse(data);
        const diff = dayjs().diff(dayjs(data.createdAtTs * 1000), "minute");
        if (diff < CACHE_MIN) {
          dispatch(createDataFrame(data.docs));
          console.log("Loaded parsed data from cache !");
          return;
        }
      }
      api.getAllParsedData().then((docs) => {
        dispatch(clearDataFrame());
        const data = [];
        for (let d of docs) {
          for (let key of Object.keys(d)) {
            d[key]["created_at"] = d[key].created_at.seconds;
            const ordered = Object.keys(d[key])
              .sort()
              .reduce((obj, k) => {
                obj[k] = d[key][k];
                return obj;
              }, {});
            data.push(ordered);
          }
        }
        const d = { docs: data, createdAtTs: dayjs().unix() };
        localStorage.setItem("parsedData", JSON.stringify(d));
        dispatch(createDataFrame(data));
      });
    }

    return () => {
      dispatch(clearDataFrame());
    };
  }, [dispatch]);
}
