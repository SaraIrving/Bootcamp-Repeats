const express = require('express');
const app = express();
const PORT = 8080; //default port

app.set("view engine", "ejs") //set ejs as the view engine 

//sample of what data will look like
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

//get json format of urlDatabase data
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// send HTML in the response
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = {urls:  urlDatabase};
  res.render("urls_index", templateVars);
})

// access via curl request in command line with: curl -i http://localhost:8080/hello

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

