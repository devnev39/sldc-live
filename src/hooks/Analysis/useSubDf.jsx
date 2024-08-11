import dayjs from "dayjs";
import { useEffect, useState } from "react";

export const useSubDf = (df) => {
  const [subDf, setSubDf] = useState(null);
  useEffect(() => {
    if (df == null) return;
    // Implement window size
    const yesterdayStartingHour = dayjs()
      .add(-dayjs().hour() - 24 - 7, "hour")
      .add(-dayjs().minute(), "minute")
      .unix();
    const subdf = df.loc({
      rows: df["created_at"].gt(yesterdayStartingHour),
    });
    setSubDf(subdf);
  }, []);
  return {
    subDf,
    setSubDf,
  };
};
