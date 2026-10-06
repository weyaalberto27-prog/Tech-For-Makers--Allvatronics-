import {
  db,
  auth,
  isRemixed,
  handleFirestoreError,
  OperationType,
} from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export interface ProjectData {
  id?: string;
  ownerId: string;
  name: string;
  elements?: string;
  pcbElements?: string;
  parts?: any[];
  wiringConnections?: any[];
  updateAt?: any;
  updatedAt?: any;
}

export const saveProject = async (
  ownerId: string,
  name: string,
  elements: any,
  pcbElements: any,
  projectId?: string,
) => {
  if (isRemixed || !auth?.currentUser || !ownerId || ownerId === "guest_user") {
    const lsData = localStorage.getItem("allvatronics_projects");
    const projects = lsData && lsData !== "undefined" ? JSON.parse(lsData) : [];
    if (projectId) {
      const p = projects.find((x: any) => x.id === projectId);
      if (p) {
        p.elements = JSON.stringify(elements);
        p.pcbElements = JSON.stringify(pcbElements);
        p.updateAt = { toDate: () => new Date() };
      }
    } else {
      projectId = uuidv4();
      projects.push({
        id: projectId,
        ownerId: ownerId || "guest_user",
        name,
        elements: JSON.stringify(elements),
        pcbElements: JSON.stringify(pcbElements),
        updateAt: { toDate: () => new Date() },
      });
    }
    localStorage.setItem("allvatronics_projects", JSON.stringify(projects));
    return projectId;
  }

  const projectsRef = collection(db, "projects");

  const projectData = {
    ownerId,
    name,
    elements: JSON.stringify(elements),
    pcbElements: JSON.stringify(pcbElements),
    updateAt: Timestamp.now(),
  };

  try {
    // Keep local cache in sync for resilience
    try {
      const lsData = localStorage.getItem("allvatronics_projects");
      const lsProjects = lsData && lsData !== "undefined" ? JSON.parse(lsData) : [];
      const pid = projectId || uuidv4();
      const existingIdx = lsProjects.findIndex((x: any) => x.id === pid);
      if (existingIdx >= 0) {
        lsProjects[existingIdx] = { ...lsProjects[existingIdx], ownerId, name, elements: JSON.stringify(elements), pcbElements: JSON.stringify(pcbElements), id: pid, updateAt: { toDate: () => new Date() } };
      } else {
        lsProjects.push({ ownerId, name, elements: JSON.stringify(elements), pcbElements: JSON.stringify(pcbElements), id: pid, updateAt: { toDate: () => new Date() } });
      }
      localStorage.setItem("allvatronics_projects", JSON.stringify(lsProjects));
    } catch (e) {}

    if (projectId) {
      const docRef = doc(db, "projects", projectId);
      await updateDoc(docRef, projectData);
      return projectId;
    } else {
      const docRef = await addDoc(projectsRef, projectData);
      return docRef.id;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "projects");
    throw error;
  }
};

export const getProjects = async (ownerId: string) => {
  if (isRemixed || !auth?.currentUser || !ownerId || ownerId === "guest_user") {
    const lsData = localStorage.getItem("allvatronics_projects");
    const projects = lsData && lsData !== "undefined" ? JSON.parse(lsData) : [];
    return projects.map((p: any) => ({
      ...p,
      updateAt: {
        toDate: () => new Date(p.updateAt?.toDate ? new Date() : p.updateAt || p.updatedAt || new Date()),
      },
    }));
  }

  const q = query(collection(db, "projects"), where("ownerId", "==", ownerId));
  try {
    const querySnapshot = await getDocs(q);
    const projects: ProjectData[] = [];
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() } as ProjectData);
    });
    // Cache to localStorage
    try {
      if (projects.length > 0) {
        localStorage.setItem("allvatronics_projects", JSON.stringify(projects));
      }
    } catch(e) {}
    return projects;
  } catch (error) {
    console.warn("Firestore getProjects error, checking local storage fallback:", error);
    try {
      const lsData = localStorage.getItem("allvatronics_projects");
      const localProjects = lsData && lsData !== "undefined" ? JSON.parse(lsData) : [];
      if (localProjects.length > 0) {
        return localProjects.map((p: any) => ({
          ...p,
          updateAt: {
            toDate: () => new Date(p.updateAt?.toDate ? new Date() : p.updateAt || p.updatedAt || new Date()),
          },
        }));
      }
    } catch (e) {}
    handleFirestoreError(error, OperationType.LIST, "projects");
    return [];
  }
};

export const deleteProject = async (projectId: string) => {
  if (isRemixed || !auth?.currentUser) {
    const lsData = localStorage.getItem("allvatronics_projects");
    let projects = lsData && lsData !== "undefined" ? JSON.parse(lsData) : [];
    projects = projects.filter((x: any) => x.id !== projectId);
    localStorage.setItem("allvatronics_projects", JSON.stringify(projects));
    return;
  }

  try {
    await deleteDoc(doc(db, "projects", projectId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `projects/${projectId}`);
    throw error;
  }
};
