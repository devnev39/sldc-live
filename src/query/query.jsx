import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default {
  getAllData: async () => {},

  getDateData: async (date) => {
    let docs = collection(db, `/deploy/${date}/${date}`);
    docs = query(docs, orderBy("created_at"));
    docs = await getDocs(docs);
    docs = docs.docs.map((d) => d.data());
    return docs;
  },

  getAllParsedData: async () => {
    let docs = collection(db, "parsed");
    docs = query(docs);
    docs = await getDocs(docs);
    docs = docs.docs.map((d) => d.data());
    return docs;
  },
};
