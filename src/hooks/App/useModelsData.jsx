import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearModels, setModels } from "../../features/data";
import api from "../../query/query";

export default function useModelsData() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearModels());
    fetch("https://api.github.com/repos/devnev39/sldc-back-ml/releases")
      .then((resp) => {
        if (resp.status == 200) return resp.json();
        else {
          window.alert("Model release not found!");
        }
      })
      .then(async (data) => {
        // Fetch firebase object
        // Fetch the models and save to redux
        const docs = [];
        for (const release of data) {
          const doc = await api.getModelDoc(release["tag_name"]);
          if (import.meta.env.PROD && doc.is_prod) docs.push(doc);
          else if (!import.meta.env.PROD) docs.push(doc);
        }
        docs.sort((a, b) => a.val_mse - b.val_mse);
        dispatch(setModels(docs));
      });
  }, [dispatch]);
}
