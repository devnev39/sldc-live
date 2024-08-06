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
    console.log(dayjs(tdl * 1000).format());
    const tdh = dayjs().add(-dayjs().hour(), "hour").unix();
    console.log(dayjs(tdh * 1000).format());
    const subdf = df.loc({
      rows: df["created_at"].gt(tdl).and(df["created_at"].lt(tdh)),
    });
    console.log(subdf.shape);
    // subdf.print();
    setSubDf(subdf);
  }, []);
  return {
    subDf,
    setSubDf,
  };
};
