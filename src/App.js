import React, { useState, useEffect } from "react";
import { Button, DatePicker } from "react-rainbow-components";
import Notification from "./components/Notification/Notification";
import Spinner from "./components/Spinner/Spinner";
import {
  authenticate,
  getJournalData,
  saveJournalData
} from "./firebase/firebase";
import _dNdHandler from "./utils/dNdHandler";
import previewFileImg from "./utils/previewFileImg";
import { Modal, Input } from "react-rainbow-components";

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
  const [modal, showModal] = useState(false);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [auth, doAuth] = useState();

  useEffect(() => {
    let stored = localStorage.getItem("auth");
    if (stored) {
      let { username, password } = JSON.parse(stored);
      setUsername(username);
      setPassword(password);
      doAuth(true);
    }
  }, []);
  useEffect(() => {
    if (auth) {
      (async () => {
        showModal(false);
        setLoading(true);
        try {
          await authenticate(username, password);
          localStorage.setItem("auth", JSON.stringify({ username, password }));
          let data = await getJournalData(date);
          data = data ? data : {};
          setSelectedMood(data.mood);
          setTitle(data.title || "");
          setJournal(data.entry || "");
          setFood(data.food || "");
          setExpenses(data.expenses || "");
          setVocabulary(data.vocabulary || "");
          setFriend(data.friend || "");
          setDaySRC(data.dayPhotoUrl || "");
          setNightSRC(data.nightPhotoUrl || "");
          setPlaceSRC(data.placePhotoUrl || "");
        } catch (error) {
          console.error(error);
          localStorage.removeItem("auth");
          showNotification("load_error");
          setLoading(false);
        }
        setLoading(false);
      })();
    } else {
      showModal(true);
    }
  }, [date, auth, username, password]);

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
    })
      .then(() => {
        setLoading(false);
        showNotification("success");
      })
      .catch(error => {
        setLoading(false);
        console.error(error);
        showNotification("save_error");
      });
  };

  const dNdHandler = e => {
    const onDrop = _event => {
      const setStateMapper = {
        dayPhoto: setDaySRC,
        nightPhoto: setNightSRC,
        placePhoto: setPlaceSRC
      };
      const file = _event.dataTransfer.files[0];
      previewFileImg(
        file,
        setStateMapper[_event.currentTarget.getAttribute("id")]
      );
    };
    _dNdHandler({
      highlightClass: "highlight",
      onDrop
    })(e);
  };

  const closeNotification = () => {
    showNotification(false);
  };
  const closeModal = () => {
    showModal(false);
  };
  const handleInput = input => ({ target: { value } }) => {
    if (input === "username") {
      setUsername(value);
    } else if (input === "password") {
      setPassword(value);
    }
  };
  const handleKeyDown = ({ key }) => {
    if (key === "Enter") {
      doAuth(true);
    }
  };
  return (
    <>
      {!auth && (
        <Modal
          className="modal"
          title="Login"
          isOpen={modal}
          onRequestClose={closeModal}
        >
          <Input
            label="Email"
            onChange={handleInput("username")}
            placeholder="abc@def.com"
            type="text"
          />
          <Input
            label="Password"
            onChange={handleInput("password")}
            onKeyDown={handleKeyDown}
            placeholder="**********"
            type="password"
          />
          <div className="login-container">
            <Button
              label="Login"
              onClick={() => doAuth(true)}
              className="login"
              variant="brand"
            />
          </div>
        </Modal>
      )}
      <Spinner show={loading} />
      <Notification status={notification} onClose={closeNotification} />
      <div className="flex-box">
        <div className="date-container">
          <Button
            variant="base"
            label="<"
            onClick={() =>
              setDate(new Date(date.getTime() - 24 * 60 * 60 * 1000))
            }
          />
          <DatePicker
            formatStyle="large"
            value={date}
            label=""
            onChange={value => setDate(value)}
          />
          <Button
            variant="base"
            label=">"
            onClick={() =>
              setDate(new Date(date.getTime() + 24 * 60 * 60 * 1000))
            }
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
          <Button variant="base" label="Save" onClick={save} />
        </div>
      </div>
      <div className="flex-box">
        <div className="boxes-container">
          <div className="box-container">
            <div className="title red-pill">Food</div>
            <textarea
              value={food}
              onChange={({ target: { value } }) => setFood(value)}
              placeholder="Roti, Rice, Dal"
            ></textarea>
          </div>
          <div className="box-container">
            <div className="title blue-pill">Expenses</div>
            <textarea
              value={expenses}
              onChange={({ target: { value } }) => setExpenses(value)}
              placeholder="2euro travel"
            ></textarea>
          </div>
          <div className="box-container">
            <div className="title green-pill">Vocabulary</div>
            <textarea
              value={vocabulary}
              onChange={({ target: { value } }) => setVocabulary(value)}
              placeholder="floccinaucinihilipilification"
            ></textarea>
          </div>
          <div className="box-container">
            <div className="title yellow-pill">Friend of the day</div>
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
    </>
  );
}

export default App;
