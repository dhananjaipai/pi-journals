import _firebase from "firebase/app";
import "firebase/firestore";
import "firebase/firebase-storage";
import getDateKey from "../utils/getDateKey";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

const firebase = _firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storage = firebase.storage().ref();

export const getJournalData = date =>
  db
    .collection("pi-journals")
    .doc(getDateKey(date))
    .get()
    .then(snapshot => snapshot.data());

export const saveJournalData = ({ date, ...body }) =>
  Promise.all([
    body.dayPhotoUrl
      ? storage
          .child(getDateKey(date) + "/day_photo.jpg")
          .putString(body.dayPhotoUrl, "data_url")
      : "",
    body.nightPhotoUrl
      ? storage
          .child(getDateKey(date) + "/night_photo.jpg")
          .putString(body.nightPhotoUrl, "data_url")
      : "",
    body.placePhotoUrl
      ? storage
          .child(getDateKey(date) + "/place_photo.jpg")
          .putString(body.placePhotoUrl, "data_url")
      : ""
  ])
    .then(snapshots =>
      Promise.all(
        snapshots.map(snapshot =>
          snapshot ? snapshot.ref.getDownloadURL() : ""
        )
      )
    )
    .then(([dayPhotoUrl, nightPhotoUrl, placePhotoUrl]) => {
      console.log(dayPhotoUrl, nightPhotoUrl, placePhotoUrl);
      return db
        .collection("pi-journals")
        .doc(getDateKey(date))
        .set({
          ...body,
          dayPhotoUrl,
          nightPhotoUrl,
          placePhotoUrl
        });
    });
