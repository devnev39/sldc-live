import dayjs from "dayjs";
import { useEffect, useState } from "react";

export const useSubDf = (df) => {
  const [subDf, setSubDf] = useState(null);
  useEffect(() => {
    if (df == null) return;
    // Implement window size
    let tdl = dayjs()
      .add(-dayjs().hour() - 12, "hours")
      .add(-dayjs().minute() - 30, "minutes")
      .toString();
    tdl = dayjs(tdl).unix();
    const subdf = df.loc({ rows: df["created_at"].gt(tdl) });
    // console.log(subdf.shape);
    // subdf.print();
    setSubDf(subdf);
  }, []);
  return {
    subDf,
    setSubDf,
  };
};
