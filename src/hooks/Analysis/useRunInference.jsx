import { useEffect } from "react";
import {
  firstInference,
  runIterativeInference,
} from "../../inference/inference";

/**
 * Runs inference on the dataset with provided model session
 * Returns the result in the form of updated subdf
 * modelSession: Onnx runtime session of selected model
 * subDf: Main subdf with last 2 days of data (+window_size which is 7)
 * setSubDf: setter for the subdf
 * models: Model list
 * modelIndex: Selected model index
 */
function useRunInference(modelSession, subDf, setSubDf, models, modelIndex) {
  const runInference = async () => {
    if (!subDf) return;
    console.log("Running inference -> ");
    if (
      subDf.columns.filter((i) => i == models[modelIndex].tag_name).length != 0
    )
      return;
    if (!modelSession) return;

    let isFirstInference = true;

    for (let model of models) {
      if (subDf.columns.filter((i) => i == model.tag_name).length) {
        isFirstInference = false;
        break;
      }
    }

    let subdf = subDf.copy();

    if (isFirstInference) {
      subdf = await firstInference(models[modelIndex], subDf, modelSession);
      subdf = await runIterativeInference(
        subdf,
        models[modelIndex],
        modelSession,
      );
    } else {
      subdf = await runIterativeInference(
        subdf,
        models[modelIndex],
        modelSession,
        false,
      );
    }
    setSubDf(subdf);
  };
  useEffect(() => {
    if (!subDf) return;
    runInference();
  }, [subDf, modelSession]);

  return {
    subDf,
  };
}

export default useRunInference;