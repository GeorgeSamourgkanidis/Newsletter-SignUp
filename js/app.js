const express = require('express');
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require('@mailchimp/mailchimp_marketing');
const path = require('path');
const https = require("https");
const app = express();
const parentDir = path.normalize(__dirname + "/..");

// κανω configure το mailchimp
mailchimp.setConfig({
  apiKey: "7760d3186af85eae25a05f7e695c00e6-us7",
  server: "us7"
});
// Για να μπορουμε να διαβάσουμε static αρχεία css images ορίζουμε static directory
app.use(express.static(path.normalize(__dirname + "/../public")));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(parentDir + "/signup.html");
});

app.post("/", function(req, res) {
  const listId = "604c76e00d";
  const subscribingUser = {
    firstName: req.body.fName,
    surname: req.body.lName,
    email: req.body.email
  }
  // ετσι κανω request απο mailchimp και εμφανίζω success ή failure
  async function run() {
    try{
     const response = await mailchimp.lists.addListMember(listId, {
       email_address: subscribingUser.email,
       status: "subscribed",
       merge_fields: {
         FNAME: subscribingUser.firstName,
         LNAME: subscribingUser.surname
       }
     });
     res.sendFile(parentDir + "/success.html");
   } catch(e) {
     res.sendFile(parentDir + "/failure.html");
   }
  };
   run();
});

app.post("/failure", function(req,res){
  res.redirect("/");
});
//Για heroku και 3000
app.listen(process.env.PORT || 3000, function() {
  console.log("started");
});
