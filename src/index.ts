import * as dotenv from "dotenv";
import express from "express";
import * as admin from "firebase-admin";

dotenv.config();

const port = process.env.PORT || 3000;
let encryptedAdminSAK = process.env.MATBAY_SERVICE_ACCOUNT_KEY;

if (encryptedAdminSAK == undefined) {
	console.log("Unable to start server: firebase admin service acount key not found in ENV: MATBAY_SERVICE_ACCOUNT_KEY");
	encryptedAdminSAK = "";
	stop();
}

const adminSAK = JSON.parse(Buffer.from(encryptedAdminSAK, "base64").toString());

admin.initializeApp({
	credential: admin.credential.cert(adminSAK),
	databaseURL: "https://matbactivity.firebaseio.com"
});

const app = express();
app.get("/:id", (req, res) => {
	admin
		.auth()
		.verifyIdToken(req.params.id)
		.then(decodedToken => console.log(decodedToken.uid))
		.catch(reason => console.log(reason));

	res.send("lol sa merch pa");
});

app.listen(port, () => {
	console.log("Server started");
});