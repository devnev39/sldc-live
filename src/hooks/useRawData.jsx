import { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { NavbarContext } from "../context/navbarContext";
import api from "../query/query";
import { clearData, filterData, parseData } from "../features/data";

export default function useRawData() {
  const { date } = useContext(NavbarContext);
  const dispatch = useDispatch();
  useEffect(() => {
    // This useffect is used for :
    // Fetch the data
    // Parse the data
    // Filter the data
    if (import.meta.env.VITE_APPMODE !== "DEBUG") {
      api.getDateData(date.format("YYYY-MM-DD")).then((docs) => {
        dispatch(clearData());
        dispatch(parseData(docs));
        dispatch(filterData());
      });
    }
    return () => {
      dispatch(clearData());
    };
  }, [date, dispatch]);
}
