import { v4 as uuidv4 } from 'uuid'
import { initializeApp } from 'firebase/app'
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth'
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc
} from 'firebase/firestore'
const firebaseConfig = {
  apiKey: 'AIzaSyAg8Hrl2oD6wejmmiMgwZIMoPZAJAYuymk',
  authDomain: 'vgu-project-berlin.firebaseapp.com',
  databaseURL:
    'https://vgu-project-berlin-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'vgu-project-berlin',
  storageBucket: 'vgu-project-berlin.appspot.com',
  messagingSenderId: '123182587449',
  appId: '1:123182587449:web:7ec0030b14f70f3cb4b7e8',
  measurementId: 'G-E04GQ56NQ3'
}
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider()
const signInWithGoogle = async (org: string) => {
  try {
    const res = await signInWithPopup(auth, googleProvider)
    const user = res.user
    const q = query(collection(db, 'users'), where('uid', '==', user.uid))
    const docs = await getDocs(q)
    if (docs.docs.length === 0) {
      if (org === '1') {
        await addDoc(collection(db, 'users'), {
          uid: user.uid,
          name: user.displayName,
          id: 'x509::/C=US/ST=North Carolina/O=Hyperledger/OU=client/CN=minter::/C=US/ST=North Carolina/L=Durham/O=org1.example.com/CN=ca.org1.example.com',
          api: 'c8caa01f-df2d-4be7-99d4-9e8ab0f370e0',
          authProvider: 'google',
          email: user.email
        })
      }
      if (org === '2') {
        await addDoc(collection(db, 'users'), {
          uid: user.uid,
          name: user.displayName,
          id: 'x509::/C=US/ST=North Carolina/O=Hyperledger/OU=client/CN=minter::/C=UK/ST=Hampshire/L=Hursley/O=org2.example.com/CN=ca.org2.example.com',
          api: 'e8ef8e47-7570-4165-8e87-c20bfd91fad1',
          authProvider: 'google',
          email: user.email
        })
      }
      if (org === '3') {
        await addDoc(collection(db, 'users'), {
          uid: user.uid,
          name: user.displayName,
          id: 'x509::/C=US/ST=North Carolina/O=Hyperledger/OU=client/CN=minter::/C=US/ST=North Carolina/L=Raleigh/O=org3.example.com/CN=ca.org3.example.com',
          api: 'i9flae32-10dk-3849-1l44-19lqoexnveoq',
          authProvider: 'google',
          email: user.email
        })
      }
    }
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}

const logout = () => {
  signOut(auth)
}
export { auth, db, signInWithGoogle, logout }
