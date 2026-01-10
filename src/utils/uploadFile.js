import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../Firebase";

export async function uploadFile(file, path) {
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}
