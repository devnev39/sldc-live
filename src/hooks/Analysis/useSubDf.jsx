import dayjs from "dayjs";
import { useEffect, useState } from "react";

export const useSubDf = (df) => {
  const [subDf, setSubDf] = useState(null);
  const [defaultSubDfLen, setDefaultSubDfLen] = useState(0);
  useEffect(() => {
    if (df == null) return;
    // Implement window size
    const startingHour = dayjs()
      .add(-dayjs().hour() - 24 - 7, "hour")
      .add(-dayjs().minute(), "minute")
      .unix();

    // const yesterdayStartingHour = dayjs().add(-dayjs().hour() - 24, "hour").add(-dayjs().minute(), "minute").unix();
    const subdf = df.loc({
      rows: df["created_at"].gt(startingHour),
    });
    setSubDf(subdf);
    setDefaultSubDfLen(subdf.shape[0]);
  }, []);
  return {
    subDf,
    setSubDf,
    defaultSubDfLen,
  };
};
