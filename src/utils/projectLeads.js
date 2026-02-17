import { db } from "../Firebase";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

const COL = "project_leads";

// Save form data from project card form
export async function submitProjectLead(payload) {
  const data = {
    projectId: payload.projectId || "",
    projectTitle: payload.projectTitle || "",

    name: payload.name?.trim() || "",
    phone: payload.phone?.trim() || "",
    email: payload.email?.trim() || "",
    message: payload.message?.trim() || "",

    status: "new",
    createdAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, COL), data);
  return ref.id;
}

// Admin: fetch form data with filters
export async function getProjectLeadsFiltered({
  projectId,
  status,
  email,
  pageSize = 100,
} = {}) {
  // base query
  let q = query(collection(db, COL), orderBy("createdAt", "desc"), limit(pageSize));

  // Firestore composite index may be required if you combine where + orderBy.
  if (projectId) q = query(q, where("projectId", "==", projectId));
  if (status) q = query(q, where("status", "==", status));
  if (email) q = query(q, where("email", "==", email.trim()));

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
