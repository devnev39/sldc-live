import dayjs from "dayjs";
import { useEffect, useState } from "react";

export const useSubDf = (df) => {
  const [subDf, setSubDf] = useState(null);
  useEffect(() => {
    if (df == null) return;
    // Implement window size
    const tdl = dayjs()
      .add(-dayjs().hour() - 7, "hour")
      .add(-dayjs().minute(), "minute")
      .unix();
    const tdh = dayjs().add(-dayjs().hour(), "hour").unix();
    const subdf = df.loc({
      rows: df["created_at"].gt(tdl).and(df["created_at"].lt(tdh)),
    });
    setSubDf(subdf);
  }, []);
  return {
    subDf,
    setSubDf,
  };
};
