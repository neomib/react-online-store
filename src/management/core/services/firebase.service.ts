import firebase, { firestore, functions } from "firebase";

class FirebaseService
{
  database: firestore.Firestore;
  constructor()
  {
    // Initialize Firebase
    // let config = {
    //   apiKey: "AIzaSyD77IcKgfu3a5lN0L3ifoeaFtRs84d4ihY",
    //   authDomain: "online-store-a23f1.firebaseapp.com",
    //   databaseURL: "https://online-store-a23f1.firebaseio.com",
    //   projectId: "online-store-a23f1",
    //   storageBucket: "online-store-a23f1.appspot.com",
    //   messagingSenderId: "1072948968003"
    // };
    firebase.initializeApp({
      apiKey: 'AIzaSyD77IcKgfu3a5lN0L3ifoeaFtRs84d4ihY',
      authDomain: 'online-store-a23f1.firebaseapp.com',
      projectId: 'online-store-a23f1'
    });
    this.database = firebase.firestore();
  }
  public setDoc(collectionPath: string, docPath: string, data: firestore.DocumentData)
  {
    return this.database.collection(collectionPath).doc(docPath).set(data,{ merge: true });
  }
  public updateDoc(collectionPath: string, docPath: string, data: firestore.DocumentData)
  {
    return this.database.collection(collectionPath).doc(docPath).update(data);
  }
  
  subscribeToDocData(collectionPath: string, docPath: string, callback: (result: firestore.DocumentData | undefined) => void)
  {
    let doc = this.database.collection(collectionPath).doc(docPath);
    if (doc)
    {
      doc.onSnapshot(docSnapshot =>
      {
        if (docSnapshot)
          callback(docSnapshot.data());
        else
          callback(undefined);
      })
    }
    else
    {
      callback(undefined);
    }
  }
}
export let firebaseService = new FirebaseService();