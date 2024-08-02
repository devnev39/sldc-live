import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearDataFrame, createDataFrame } from "../features/data";
// import { Timestamp } from "firebase/firestore";
import api from "../query/query";

export default function useParsedData() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (import.meta.env.VITE_APPMODE !== "DEBUG") {
      const data = localStorage.getItem("parsedData");
      if (data) {
        dispatch(createDataFrame(JSON.parse(data)));
        console.log("Loaded parsed data from cache !");
        return;
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
        localStorage.setItem("parsedData", JSON.stringify(data));
        dispatch(createDataFrame(data));
      });
    }

    return () => {
      dispatch(clearDataFrame());
    };
  }, [dispatch]);
}
