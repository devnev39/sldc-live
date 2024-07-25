import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
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

  getModelDoc: async (tag_name) => {
    let doc = query(
      collection(db, "models"),
      where("tag_name", "==", tag_name),
    );
    doc = await getDocs(doc);
    return doc.docs.map((i) => i.data())[0];
  },
};
