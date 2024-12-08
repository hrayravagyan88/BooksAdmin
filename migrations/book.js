import { collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

async function migrateBooks() {
  const booksRef = collection(db, 'books'); // Reference to the 'books' collection
  const snapshot = await getDocs(booksRef);

  snapshot.forEach(async (doc) => {
    await updateDoc(doc.ref, {
      isActive: true,
      isVisibleHome: true,
      order: 1,  // Adjust as needed
    });
  });
}

// migrateBooks();
