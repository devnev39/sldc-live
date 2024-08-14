import dayjs from "dayjs";
import { useEffect, useState } from "react";

/**
 * truePredictionMode: Gets subdf only yesterday's day before 7 hour reading to predict from
 */
export const useSubDf = (df, truePredictionMode) => {
  const [subDf, setSubDf] = useState(null);
  const [defaultSubDfLen, setDefaultSubDfLen] = useState(0);
  useEffect(() => {
    if (df == null) return;
    // Implement window size
    const startingHour = dayjs()
      .add(-dayjs().hour() - 24 - 7, "hour")
      .add(-dayjs().minute(), "minute")
      .unix();

    const yesterdayStartingHour = dayjs()
      .add(-dayjs().hour() - 24, "hour")
      .add(-dayjs().minute(), "minute")
      .unix();
    let subdf = null;
    if (!truePredictionMode) {
      subdf = df.loc({
        rows: df["created_at"].gt(startingHour),
      });
    } else {
      subdf = df.loc({
        rows: df["created_at"]
          .gt(startingHour)
          .and(df["created_at"].lt(yesterdayStartingHour)),
      });
    }
    setSubDf(subdf);
    setDefaultSubDfLen(subdf.shape[0]);
  }, [truePredictionMode]);
  return {
    subDf,
    setSubDf,
    defaultSubDfLen,
  };
};
