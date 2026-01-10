import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../Firebase";

export const saveContactMessage = async (data) => {
  await addDoc(collection(db, "contactMessages"), {
    ...data,
    createdAt: serverTimestamp(),
    source: "contact-us",
  });
};
