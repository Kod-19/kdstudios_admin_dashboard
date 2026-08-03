import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../lib/firebase/firebase";

const SERVICES_COLLECTION = "services";
const TESTIMONIALS_COLLECTION = "testimonials";
const TEAM_COLLECTION = "teamMembers";
const FAQ_COLLECTION = "faq";
const GALLERY_COLLECTION = "gallery";

export const contentService = {
  async getServices() {
    const q = query(
      collection(db, SERVICES_COLLECTION),
      orderBy("sortOrder", "asc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  },

  async createService(data) {
    const payload = {
      title: data.title || "",
      description: data.description || "",
      icon: data.icon || "",
      sortOrder: Number(data.sortOrder || 0),
      featured: Boolean(data.featured),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const ref = await addDoc(collection(db, SERVICES_COLLECTION), payload);
    return ref.id;
  },

  async updateService(id, data) {
    await updateDoc(doc(db, SERVICES_COLLECTION, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteService(id) {
    await deleteDoc(doc(db, SERVICES_COLLECTION, id));
  },

  async reorderServices(items) {
    const batch = writeBatch(db);
    items.forEach((item, index) => {
      batch.update(doc(db, SERVICES_COLLECTION, item.id), {
        sortOrder: index,
        updatedAt: serverTimestamp(),
      });
    });
    await batch.commit();
  },

  async getTestimonials() {
    const q = query(
      collection(db, TESTIMONIALS_COLLECTION),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  },

  async createTestimonial(data) {
    const ref = await addDoc(collection(db, TESTIMONIALS_COLLECTION), {
      name: data.name || "",
      role: data.role || "",
      quote: data.quote || "",
      approved: Boolean(data.approved),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  },

  async updateTestimonial(id, data) {
    await updateDoc(doc(db, TESTIMONIALS_COLLECTION, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteTestimonial(id) {
    await deleteDoc(doc(db, TESTIMONIALS_COLLECTION, id));
  },

  async getTeamMembers() {
    const q = query(
      collection(db, TEAM_COLLECTION),
      orderBy("sortOrder", "asc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  },

  async createTeamMember(data) {
    const ref = await addDoc(collection(db, TEAM_COLLECTION), {
      name: data.name || "",
      position: data.position || "",
      bio: data.bio || "",
      photoUrl: data.photoUrl || "",
      socialLinks: data.socialLinks || {},
      sortOrder: Number(data.sortOrder || 0),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  },

  async updateTeamMember(id, data) {
    await updateDoc(doc(db, TEAM_COLLECTION, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteTeamMember(id) {
    await deleteDoc(doc(db, TEAM_COLLECTION, id));
  },

  async getFaqItems() {
    const q = query(
      collection(db, FAQ_COLLECTION),
      orderBy("sortOrder", "asc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  },

  async createFaqItem(data) {
    const ref = await addDoc(collection(db, FAQ_COLLECTION), {
      question: data.question || "",
      answer: data.answer || "",
      sortOrder: Number(data.sortOrder || 0),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  },

  async updateFaqItem(id, data) {
    await updateDoc(doc(db, FAQ_COLLECTION, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteFaqItem(id) {
    await deleteDoc(doc(db, FAQ_COLLECTION, id));
  },

  async getGalleryItems() {
    const q = query(
      collection(db, GALLERY_COLLECTION),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  },

  async createGalleryItem(data) {
    const ref = await addDoc(collection(db, GALLERY_COLLECTION), {
      title: data.title || "",
      caption: data.caption || "",
      imageUrl: data.imageUrl || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  },

  async deleteGalleryItem(id) {
    await deleteDoc(doc(db, GALLERY_COLLECTION, id));
  },

  async getSiteSettings() {
    const snapshot = await getDoc(doc(db, "siteSettings", "global"));
    return snapshot.exists() ? snapshot.data() : {};
  },

  async updateSiteSettings(data) {
    await updateDoc(doc(db, "siteSettings", "global"), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async uploadToCloudinary(file, folder = "kd-studios") {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary environment variables are not configured.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error?.message || "Cloudinary upload failed.");
    }

    return {
      secureUrl: result.secure_url,
      publicId: result.public_id,
      assetId: result.asset_id,
    };
  },
};
