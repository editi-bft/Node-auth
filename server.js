const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET =
  "sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk";

mongoose.connect("mongodb://localhost:27017/login-app-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use("/", express.static(path.join(__dirname, "static")));
app.use(bodyParser.json());

app.post("/api/reset-password", async (req, res) => {
  const { email,password : plainTextPassword } = req.body;
 
  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid password" });
  }

  if (plainTextPassword.length < 6) {
    return res.json({
      status: "error",
      error: "Password too small. Should be atleast 6 characters",
    });
  }

  try {   

    const password = await bcrypt.hash(plainTextPassword, 10);

    await User.updateOne(
      { email },
      {
        $set: { password },
      }
    );
    res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: ";))" });
  }
});

app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;

  let api_key = "dc256b3b0a68ebb0633326a296a022d8-835621cf-1da7da6d";
  let domain = "sandbox0025fd92892849f0a7a16ca88c9791f8.mailgun.org";
  let mailgun = require("mailgun-js");
  const mg = mailgun({ apiKey: api_key, domain: domain });

  if (!email || typeof email !== "string") {
    return res.json({ status: "error", error: "Invalid email" });
  }
  const user = await User.findOne({ email }).lean();

  if (!user) {
    return res.json({ status: "error", error: "You are not registered, Please register first!!" });
  }
  
  
  try {
    let data = {
      from: 'Mailgun Sandbox <postmaster@sandbox0025fd92892849f0a7a16ca88c9791f8.mailgun.org>',
      to: [email],
      subject: 'Forgot-Password',
      html: `<a href='http://localhost:9999/reset-password.html?email=${email}'>Click Here</a>`
    };
    mg.messages().send(data, function (error, body) {
      if(error){
        console.log(error)
      }
      console.log('mail sent',body)
      // helper.apiResponse(res, 1, body);
    });


    res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: ";))" });
  }
});

app.post("/api/change-password", async (req, res) => {
  const { token, newpassword: plainTextPassword } = req.body;

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid password" });
  }

  if (plainTextPassword.length < 6) {
    return res.json({
      status: "error",
      error: "Password too small. Should be atleast 6 characters",
    });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);

    const _id = user.id;

    const password = await bcrypt.hash(plainTextPassword, 10);

    await User.updateOne(
      { _id },
      {
        $set: { password },
      }
    );
    res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: ";))" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).lean();

  if (!user) {
    return res.json({ status: "error", error: "email/password" });
  }
  console.log(user);
  if (await bcrypt.compare(password, user.password)) {
    // the username, password combination is successful

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      JWT_SECRET
    );

    return res.json({ status: "ok", data: token });
  }

  res.json({ status: "error", error: "Invalid email/password" });
});

app.post("/api/register", async (req, res) => {
  const { username, password: plainTextPassword,email,mobile } = req.body;

  if (!username || typeof username !== "string") {
    return res.json({ status: "error", error: "Invalid username" });
  }

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid password" });
  }

  if (!email || typeof email !== "string") {
    return res.json({ status: "error", error: "Invalid email" });
  }

  if (!mobile|| typeof mobile!== "string") {
    return res.json({ status: "error", error: "Invalid mobile" });
  }

  if (plainTextPassword.length < 6) {
    return res.json({
      status: "error",
      error: "Password too small. Should be atleast 6 characters",
    });
  }

  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    const response = await User.create({
      username,
      password,
      email,
      mobile
    });
    console.log("User created successfully: ", response);
  } catch (error) {
    if (error.code === 11000) {
      // duplicate key
      return res.json({ status: "error", error: "Email already in use" });
    }
    throw error;
  }

  res.json({ status: "ok" });
});

app.listen(9999, () => {
  console.log("Server up at 9999");
});
