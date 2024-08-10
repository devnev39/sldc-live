import { useEffect, useState } from "react";
import * as ort from "onnxruntime-web/webgpu";

ort.env.debug = true;
ort.env.wasm.numThreads = 1;
/**
 * Start new session for loaded model depending on the modelIndex
 * modelIndex: Index of loaded model
 * models: Models list
 */
function useModelSession(models, modelIndex) {
  const [modelSession, setModelSession] = useState(null);

  const loadModel = async () => {
    const link = models[modelIndex].link;
    const cache = await caches.open("onnx");
    let resp = await cache.match(link);
    if (resp == undefined) {
      await cache.add(link);
      resp = await cache.match(link);
      console.log("Model cached!");
    } else {
      console.log("Model loaded from cache!");
    }
    const buffer = await resp.arrayBuffer();
    const opt = {
      executionProviders: ["webgpu", "wasm"],
    };

    const session = await ort.InferenceSession.create(buffer, opt);
    setModelSession(session);
  };

  useEffect(() => {
    if (models.length == 0) return;
    loadModel();
  }, [models, modelIndex]);

  return modelSession;
}

export default useModelSession;
