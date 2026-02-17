import { db } from "../Firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import { getCountFromServer } from "firebase/firestore";

const COL = "projects";

export async function addProject(payload) {
  const images = Array.isArray(payload.images) ? payload.images : [];
  const mainImage = payload.mainImage || images[0] || "";

  const data = {
    title: payload.title?.trim() || "",
    location: payload.location?.trim() || "",
    area: payload.area?.trim() || "",
    images,
    mainImage, // ✅ NEW
    status: payload.status || "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, COL), data);
  return ref.id;
}
export async function updateProject(projectId, payload) {
  const ref = doc(db, COL, projectId);
  await updateDoc(ref, {
    ...payload,
    updatedAt: serverTimestamp(),
  });
}

export async function getProjectById(projectId) {
  const ref = doc(db, COL, projectId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function getProjectsCount() {
  const coll = collection(db, COL);
  const snapshot = await getCountFromServer(coll);
  return snapshot.data().count;
}

// Admin list (simple, not paginated)
export async function getAllProjects() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Public page pagination (optional)
export async function getProjectsPage({ pageSize = 9, cursorDoc = null } = {}) {
  const base = query(
    collection(db, COL),
    orderBy("createdAt", "desc"),
    limit(pageSize)
  );

  const q = cursorDoc
    ? query(
        collection(db, COL),
        orderBy("createdAt", "desc"),
        startAfter(cursorDoc),
        limit(pageSize)
      )
    : base;

  const snap = await getDocs(q);
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const lastDoc = snap.docs.length ? snap.docs[snap.docs.length - 1] : null;

  return { items, lastDoc };
}
