import React from "react";
import { initializeApp } from "firebase/app";
import DummyComponent from "./dummyComponent";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { firebaseConfig } from "./db";
import { useAuth0 } from "@auth0/auth0-react";
const { Configuration, OpenAIApi } = require("openai");
function PatientReport() {
  const { loginWithPopup, logout, user, isAuthenticated } = useAuth0();
  const containerStyle = {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f0f0f0",
    margin: 0,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  const reportContainerStyle = {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)",
    padding: "30px",
    textAlign: "center",
    width: "50%",
  };

  const reportInfoStyle = {
    marginBottom: "30px",
    textAlign: "start",
  };

  const testReportStyle = {
    marginTop: "20px",
    textAlign: "left",
  };

  const viewReportButtonStyle = {
    width: "200px",
    height: "50px",
    border: "none",
    backgroundColor: "#007BFF",
    color: "#fff",
    fontSize: "18px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };
  async function mew() {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const userEmail = user.email;
    console.log(user);
    const configuration = new Configuration({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const userDocRef = doc(db, "PatientData", "subhadipsaha@gmail.com");
    try {
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        // If the document doesn't exist, create it with the initial array

        console.log(docSnap);
      } else {
        const chatHistory = docSnap.data().chatHistory || [];
        console.log(chatHistory);
        chatHistory.push({
          role: "user",
          content:
            "MISSION\
          You are a medical notes bot that will be given a chart or symptoms for a patient shortly after intake. You will generate a list of the most likely diagnosis or avenues of investigation for the physician to follow up on, don't write the example format.\
          \
          INTERACTION SCHEMA\
          The USER will give you the medical chat. You will generate a report with the following format\
          \
          REPORT FORMAT\
          : <Write Description of the condition, common alternative names, etc>\
          \
          DIFFERENTIALS:\
          DEMOGRAPHICS: <Write Typical demographic of affliction, demographic risk factors>\
          SYMPTOMS:\
          INDICATORS:\
          CONTRAINDICATORS: <Why this patient doesn't match this diagnosis>\
          PROGNOSIS:\
          TREATMENT:\
          TESTS: <Recommended follow up tests, and what you're looking for, probative information desired>\
          : <Description of the condition, common alternative names, etc>\
          \
          DIFFERENTIALS:\
          DEMOGRAPHICS: <Typical demographic of affliction, demographic risk factors>\
          SYMPTOMS:\
          INDICATORS:\
          CONTRAINDICATORS: <Why this patient doesn't match this diagnosis>\
          PROGNOSIS:\
          TREATMENT:\
          TESTS: <Recommended follow up tests, and what you're looking for, probative information desired>",
        });

        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: chatHistory,
          temperature: 0.2,
          max_tokens: 700,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });
        const text = completion.data.choices[0].message.content;
        console.log(text);
      }
    } catch (error) {
      console.error("Error updating/creating document:", error);
    }
  }

  return (
    <div style={containerStyle}>
      <div style={reportContainerStyle}>
        <h2>Patient Report</h2>

        <div style={reportInfoStyle}>
          <p>
            <strong>Key Points:</strong>
          </p>
          <ul>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            <li>
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </li>
            <li>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris.
            </li>
            <li>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore.
            </li>
            <li>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit.
            </li>
          </ul>
        </div>

        <div style={testReportStyle}>
          <h3>Test Reports:</h3>
          <p>
            <strong>Report 1:</strong> Lorem ipsum dolor sit amet, consectetur
            adipiscing elit.
          </p>
          <p>
            <strong>Report 2:</strong> Sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua.
          </p>
          <p>
            <strong>Report 3:</strong> Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris.
          </p>
          {/* Add more test reports as needed */}
        </div>

        <div className="button-group" onClick={mew}>
          <a>View Report Analysis</a>
        </div>
      </div>
    </div>
  );
}

export default PatientReport;
