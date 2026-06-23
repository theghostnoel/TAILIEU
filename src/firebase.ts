/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { Category, Document } from './types';
import { INITIAL_CATEGORIES, INITIAL_DOCUMENTS } from './initialData';

const firebaseConfig = {
  apiKey: "AIzaSyDEe91S-qy9rHk-eSgZvqJgN-SwTi1cquQ",
  authDomain: "aerobic-pursuit-6mvz5.firebaseapp.com",
  projectId: "aerobic-pursuit-6mvz5",
  storageBucket: "aerobic-pursuit-6mvz5.firebasestorage.app",
  messagingSenderId: "1011838344206",
  appId: "1:1011838344206:web:32801c6339275a8260b05f",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId using standard getFirestore signature
export const db = getFirestore(app, "ai-studio-aafb8a64-a83f-47d8-804f-75b41622689c");

// Collection names
const CATEGORIES_COLLECTION = 'categories';
const DOCUMENTS_COLLECTION = 'documents';

/**
 * Ensures initial seed data exists in Firestore if collections are empty.
 */
export async function seedInitialDataIfEmpty() {
  try {
    const catSnap = await getDocs(collection(db, CATEGORIES_COLLECTION));
    if (catSnap.empty) {
      console.log('Seeding initial categories into Firestore...');
      const batch = writeBatch(db);
      INITIAL_CATEGORIES.forEach((cat) => {
        const docRef = doc(db, CATEGORIES_COLLECTION, cat.id);
        batch.set(docRef, cat);
      });
      await batch.commit();
    }

    const docSnap = await getDocs(collection(db, DOCUMENTS_COLLECTION));
    if (docSnap.empty) {
      console.log('Skipping document seeding as requested by user to keep the document library custom-populated only.');
    }
  } catch (err) {
    console.error('Error seeding data into Firestore:', err);
  }
}

/**
 * Real-time listener for Categories
 */
export function subscribeCategories(onUpdate: (cats: Category[]) => void) {
  const colRef = collection(db, CATEGORIES_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    const list: Category[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as Category);
    });
    onUpdate(list);
  }, (err) => {
    console.error('Error subscribing to categories:', err);
  });
}

/**
 * Real-time listener for Documents
 */
export function subscribeDocuments(onUpdate: (docs: Document[]) => void) {
  const colRef = collection(db, DOCUMENTS_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    const list: Document[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as Document);
    });
    onUpdate(list);
  }, (err) => {
    console.error('Error subscribing to documents:', err);
  });
}

/**
 * Add or update a Category in Firestore
 */
export async function saveCategoryToFirestore(category: Category) {
  const docRef = doc(db, CATEGORIES_COLLECTION, category.id);
  await setDoc(docRef, category);
}

/**
 * Delete a Category from Firestore and all its descendant documents/subcategories recursively
 */
export async function deleteCategoryFromFirestore(categoryId: string) {
  // First delete the category doc itself
  await deleteDoc(doc(db, CATEGORIES_COLLECTION, categoryId));

  // Find and delete subcategories and documents that belong to this category
  try {
    const catSnap = await getDocs(collection(db, CATEGORIES_COLLECTION));
    const subCatIds: string[] = [];
    catSnap.forEach((d) => {
      const data = d.data() as Category;
      if (data.parent_id === categoryId) {
        subCatIds.push(data.id);
      }
    });

    // Delete subcategories
    for (const subId of subCatIds) {
      await deleteDoc(doc(db, CATEGORIES_COLLECTION, subId));
    }

    // Delete related documents
    const docSnap = await getDocs(collection(db, DOCUMENTS_COLLECTION));
    const docsToDelete: string[] = [];
    docSnap.forEach((d) => {
      const data = d.data() as Document;
      if (data.category_id === categoryId || subCatIds.includes(data.category_id)) {
        docsToDelete.push(data.id);
      }
    });

    for (const docId of docsToDelete) {
      await deleteDoc(doc(db, DOCUMENTS_COLLECTION, docId));
    }
  } catch (err) {
    console.error('Error in cascade deletion of categories:', err);
  }
}

/**
 * Add or update a Document in Firestore
 */
export async function saveDocumentToFirestore(document: Document) {
  const docRef = doc(db, DOCUMENTS_COLLECTION, document.id);
  await setDoc(docRef, document);
}

/**
 * Delete a Document in Firestore
 */
export async function deleteDocumentFromFirestore(documentId: string) {
  await deleteDoc(doc(db, DOCUMENTS_COLLECTION, documentId));
}

/**
 * Subscribe to real-time changes of Sponsor text
 */
export function subscribeSponsorText(onUpdate: (text: string) => void) {
  const docRef = doc(db, 'settings', 'sponsor');
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (data && typeof data.text === 'string') {
        onUpdate(data.text);
      }
    } else {
      const defaultText = "🔥 HỆ THỐNG PHÁT HÀNH: Tổng kho tài liệu học tập toàn diện - Ngoại ngữ IELTS/HSK giao tiếp, bài tập thực hành Công nghệ & Lập trình Code nâng cao hoàn toàn miễn phí! Nhấn vào tài liệu bất kỳ rồi làm theo 2 bước hướng dẫn nhanh để tải bản gốc Google Drive cực kỳ mượt mà không quảng cáo bẫy.";
      setDoc(docRef, { text: defaultText }).catch(err => console.error(err));
      onUpdate(defaultText);
    }
  }, (err) => {
    console.error('Error subscribing to sponsor text:', err);
  });
}

/**
 * Update Sponsor text in Firestore
 */
export async function saveSponsorTextToFirestore(text: string) {
  const docRef = doc(db, 'settings', 'sponsor');
  await setDoc(docRef, { text });
}
