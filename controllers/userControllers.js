// const { emit } = require("nodemon");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

function generateToken(id) {
  return jwt.sign({ userId: id }, "secretkey");
}


exports.postUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    if (
      isinvalidString(name) ||
      isinvalidString(email) ||
      isinvalidString(password)
    ) {
      return res.status(400).send("please fill the fields");
    }

    bcrypt.hash(password, 10, async (err, hash) => {
      const result = await User.create({
        name,
        email,
        password: hash,
      });
      res.send("ok");
    });
  } catch {
    res.status(500).send({ message: "user already exist with Email" });
  }
};


exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (isinvalidString(email) || isinvalidString(password)) {
    return res.status(400).send("please fill the fields");
  }
  console.log(">>>>>>>>>>>.user><<<<<<<<<<<<<")
  try {
    let user = await User.findOne({ where: { email: email } });

    
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) throw new Error("something went wrong");

        if (result)
          res.send({
            message: "logged in successfully",
            token: generateToken(user.id),
          });
        else {
          res.status(401).send({ message: "password is not matching" });
        }
      });
    } else throw new Error("username is not found");
  } catch (err) {
    err = err.toString();
    res.status(404).json({ message: err });
  }
};



exports.ispremiumUser = (req, res) => {
  let user = req.user;
  let istrue = user.ispremiumUser;
  if (istrue) res.json({ premium: istrue });
  else res.json({ premium: false });
};



function isinvalidString(string) {
  if (!string || string.length === 0) {
    return true;
  }
  return false;
}
