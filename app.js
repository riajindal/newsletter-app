const express = require("express");
const body = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(body.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email, 
                status: "subscribed",  
                merge_fields: {
                    FNAME: fname, 
                    LNAME: lname
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us12.api.mailchimp.com/3.0/lists/b76f275fa9";

    const options = {
        method: "POST", 
        auth: "ria24:a2c0d7af511ee23b08ee6e422d10e5b82-us12"
    };
    
    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

    // res.send("Sent");
})

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is runnning on port 3000");
})

// API Key
// 2c0d7af511ee23b08ee6e422d10e5b82-us12

// Audience ID
// b76f275fa9