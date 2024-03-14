import { collection, getDocs } from "firebase/firestore";
import db from "../firebase/firebase";

export default {
  getAllData: async () => {},

  getDateData: async (date) => {
    let docs = await getDocs(collection(db, `/deploy/${date}/${date}`));
    docs = docs.docs.map((d) => d.data());
    return docs;
  },
};
