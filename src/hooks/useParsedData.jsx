import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearDataFrame, createDataFrame } from "../features/data";
import { Timestamp } from "firebase/firestore";
import api from "../query/query";

export default function useParsedData() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (import.meta.env.VITE_APPMODE !== "DEBUG") {
      api.getAllParsedData().then((docs) => {
        dispatch(clearDataFrame());
        const data = [];
        for (let d of docs) {
          for (let key of Object.keys(d)) {
            let ts = new Timestamp(
              d[key].created_at.seconds,
              d[key].created_at.nanoseconds,
            );
            d[key]["created_at"] = ts.seconds;
            const ordered = Object.keys(d[key])
              .sort()
              .reduce((obj, k) => {
                obj[k] = d[key][k];
                return obj;
              }, {});
            data.push(ordered);
          }
        }
        dispatch(createDataFrame(data));
      });
    }

    return () => {
      dispatch(clearDataFrame());
    };
  }, [dispatch]);
}
