import React, { useState, useEffect } from "react";
import {
  Button,
  DatePicker,
  Spinner,
  Notification
} from "react-rainbow-components";
import { getJournalData, saveJournalData } from "./firebase/firebase";

const moods = ["happy", "neutral", "sad", "angry", "scared"];

function App() {
  const [date, setDate] = useState(new Date());

  const [selectedMood, setSelectedMood] = useState();
  const [title, setTitle] = useState("");
  const [journal, setJournal] = useState("");
  const [food, setFood] = useState("");
  const [expenses, setExpenses] = useState("");
  const [vocabulary, setVocabulary] = useState("");
  const [friend, setFriend] = useState("");

  const [daySRC, setDaySRC] = useState("");
  const [nightSRC, setNightSRC] = useState("");
  const [placeSRC, setPlaceSRC] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, showNotification] = useState(false);

  useEffect(() => {
    setLoading(true);
    getJournalData(date).then(data => {
      if (data) {
        setSelectedMood(data.mood);
        setTitle(data.title);
        setJournal(data.entry);
        setFood(data.food);
        setExpenses(data.expenses);
        setVocabulary(data.vocabulary);
        setFriend(data.friend);
        setDaySRC(data.dayPhotoUrl);
        setNightSRC(data.nightPhotoUrl);
        setPlaceSRC(data.placePhotoUrl);
      }
      setLoading(false);
    });
  }, [date]);

  const save = () => {
    setLoading(true);
    saveJournalData({
      date,
      mood: selectedMood || "",
      title,
      entry: journal,
      food,
      expenses,
      vocabulary,
      friend,
      dayPhotoUrl: daySRC,
      nightPhotoUrl: nightSRC,
      placePhotoUrl: placeSRC
    }).then(
      () => {
        setLoading(false);
        showNotification("success");
      },
      () => {
        setLoading(false);
        showNotification("error");
      }
    );
  };

  const dNdHandler = e => {
    e.preventDefault();
    e.stopPropagation();
    switch (e.type) {
      case "dragenter":
      case "dragover":
        e.currentTarget.classList.add("highlight");
        break;
      case "dragleave":
        e.currentTarget.classList.remove("highlight");
        break;
      case "drop":
        e.currentTarget.classList.remove("highlight");
        let files = e.dataTransfer.files;
        switch (e.currentTarget.id) {
          case "dayPhoto":
            previewFile(files[0], setDaySRC);
            break;
          case "nightPhoto":
            previewFile(files[0], setNightSRC);
            break;
          case "placePhoto":
            previewFile(files[0], setPlaceSRC);
            break;
          default:
            break;
        }
        break;
      default:
        console.log("this should not have happened!");
    }
  };

  const previewFile = (file, setSRC) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function() {
      setSRC(reader.result);
    };
  };

  return (
    <div>
      {loading && (
        <div className="overlay">
          <Spinner size="large" />
        </div>
      )}
      {notification === "success" && (
        <Notification
          style={{
            position: "absolute",
            right: "20px",
            top: "10px",
            zIndex: "100"
          }}
          onRequestClose={() => {
            showNotification(false);
          }}
          title="Save successful"
          description="Journal saved successfully"
          icon="success"
        />
      )}
      {notification === "error" && (
        <Notification
          style={{
            position: "absolute",
            right: "20px",
            top: "10px",
            zIndex: "100"
          }}
          onRequestClose={() => {
            showNotification(false);
          }}
          title="Save failed"
          description="Unknown error occured"
          icon="error"
        />
      )}
      <div className="flex-box">
        <div className="date-container">
          <DatePicker
            formatStyle="large"
            value={date}
            label=""
            onChange={value => setDate(value)}
          />
        </div>
        <div className="mood-container">
          <span className="title">Mood </span>
          {moods.map(mood => (
            <img
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`mood-icon ${mood === selectedMood ? "selected" : ""}`}
              alt={mood}
              src={`/assets/moods/${mood}.png`}
            />
          ))}
          <Button
            variant="base"
            label="Save"
            onClick={save}
            className="rainbow-m-around_medium"
          />
        </div>
      </div>
      <div className="flex-box">
        <div className="boxes-container">
          <div className="box-container">
            <div className="title">Food</div>
            <textarea
              value={food}
              onChange={({ target: { value } }) => setFood(value)}
              placeholder="Roti, Rice, Dal"
            ></textarea>
          </div>
          <div className="box-container">
            <div className="title">Expenses</div>
            <textarea
              value={expenses}
              onChange={({ target: { value } }) => setExpenses(value)}
              placeholder="2euro travel"
            ></textarea>
          </div>
          <div className="box-container">
            <div className="title">Vocabulary</div>
            <textarea
              value={vocabulary}
              onChange={({ target: { value } }) => setVocabulary(value)}
              placeholder="floccinaucinihilipilification"
            ></textarea>
          </div>
          <div className="box-container">
            <div className="title">Friend of the day</div>
            <textarea
              value={friend}
              onChange={({ target: { value } }) => setFriend(value)}
              placeholder="How's life!?"
            ></textarea>
          </div>
        </div>
        <div className="journal-container">
          <div className="heading">
            <input
              value={title}
              onChange={({ target: { value } }) => setTitle(value)}
              type="text"
              placeholder="Day in one line"
            />
          </div>
          <div className="body">
            <textarea
              value={journal}
              onChange={({ target: { value } }) => setJournal(value)}
              placeholder="Daily journal #gratitude"
            ></textarea>
          </div>
        </div>
        <div className="photos-container">
          <div
            onDrop={dNdHandler}
            onDragEnter={dNdHandler}
            onDragLeave={dNdHandler}
            onDragOver={dNdHandler}
            id="dayPhoto"
            className={"my-photo " + (daySRC ? "" : "default")}
          >
            <img alt="man" src={daySRC || "/assets/avatar-day.png"} />
          </div>
          <div
            onDrop={dNdHandler}
            onDragEnter={dNdHandler}
            onDragLeave={dNdHandler}
            onDragOver={dNdHandler}
            id="nightPhoto"
            className={"my-photo " + (nightSRC ? "" : "default")}
          >
            <img alt="woman" src={nightSRC || "/assets/avatar-night.png"} />
          </div>
          <div
            onDrop={dNdHandler}
            onDragEnter={dNdHandler}
            onDragLeave={dNdHandler}
            onDragOver={dNdHandler}
            id="placePhoto"
            className={"place-photo " + (placeSRC ? "" : "default")}
          >
            <img alt="woman" src={placeSRC || "/assets/placeholder.png"} />
            <div className="heading">
              <input type="text" placeholder="Where am I now?" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
