const express = require("express");
const bodyParser = require("body-parser");
//const request = require('request');
const https = require("https");


const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "signup.html");
});
app.post("/", function (req, res) {
    const Fname = req.body.Fname;
    const Lname = req.body.Lname;
    const Email = req.body.Email;
    console.log(Fname, Lname, Email);
    var data = {
        members: [{
            email_address: Email,
            status: "subscribed",
            merge_fields: {
                FNAME: Fname,
                LNAME: Lname
            }

        }]

    };
    const jsonData = JSON.stringify(data);
    const URL = "https://us6.api.mailchimp.com/3.0/lists/eae6083dd4";

    const options = {
        method: "POST",
        auth: "rk:a1b65db71b64813bde2a6edab061f61ae-us6"
    }
    const request = https.request(URL, options, function (respose) {
        if (respose.statusCode === 200) {
            res.sendFile(__dirname +"/success.html");
        } else {
            res.sendFile(__dirname+ "/failure.html");
        }

        respose.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure.html" ,function(req,res){
    res.redirect("/");
})




app.listen(process.env.PORT||3000, function (req, res) {
    console.log("Server is started and running at port 3000");
});
