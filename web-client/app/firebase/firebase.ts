import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCZL5c_ICF5e68qbBbtjDAb_7jcp-utK6U",
  authDomain: "lguedes-yt-clone.firebaseapp.com",
  projectId: "lguedes-yt-clone",
  appId: "1:211240909006:web:283180028632612056789f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function signInWithGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider());
}

export function signOut() {
  return auth.signOut;
}

export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}