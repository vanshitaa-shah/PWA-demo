const cors = require("cors"); // CORS middleware

const express = require("express"); // Express framework

const admin = require("firebase-admin"); // Firebase Admin SDK

const { v4: uuidv4 } = require("uuid"); 

const { applicationDefault } = require("firebase-admin/app");

require("dotenv").config(); // load environment variables from.env file

const app = express();

app.use(cors()); // enable CORS
app.use(express.json({ limit: "50mb" })); // parse JSON requests with 50mb limit

console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);
console.log(process.env.DATABASE_URL);

// initialize firebase admin
if (!admin.apps.length) {
  const serviceAccount = require("./pwagram-fb-key.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount) || applicationDefault(),
    databaseURL: process.env.DATABASE_URL,
  });
}

app.post("/postData", (request, response) => {
  const { title, location, image } = request.body;
  // Generate a unique UUID for the ID
  const id = uuidv4();

  console.log(request.body);

  try {
    // store data in Firebase Realtime Database
    admin.database().ref("posts").child(id).set({
      id: id,
      title: title,
      location: location,
      image: image,
    });
	console.log("POSTEDDDDD");
    response.status(201).json({ messsage: "Data stored", id: id });
  } catch (error) {
    console.error("Error storing data", error);
    response.status(500).json({ error: error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
