import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export const createAdmin = async () => {
  try {
    console.log(111 )
    const adminUser = await createUserWithEmailAndPassword(
      auth,
      "admin@example.com",
      "SuperStrongPassword123"
    );
    console.log("Admin created:", adminUser);
  } catch (error) {
    console.log(22 )
    console.error("Error creating admin:", error);
  }
};
