import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.js";

const createAdmin = async (req, res) => {
  const admin = new Admin(req.body);
  try {
    await admin.save();
    const token = await admin.generateAuthToken();

    res.status(201).send({ admin, token });
  } catch (e) {
    console.log(e);
    if (e?.keyPattern?.email === 1) {
      return res.status(400).send({
        error: "Email Already Exists",
      });
    }

    res.status(500).send({ error: "Internal Server Error" });
  }
};

const updateAdmin = async (req, res) => {
  try{
    const admin = await Admin.findOne({_id : req.admin._id});
    admin.vaccines = req.body.vaccines;
    admin.save();
    res.send(admin);
  }catch(e){
    res.status(500).send(e);
  }
}

const loginAdmin = async (req, res) => {
  try {
    const admin = await Admin.findUsingCredentials(
      req.body.email,
      req.body.password
    );

    const token = await admin.generateAuthToken();
    res.status(200).send({ admin, token });
  } catch (e) {
    res.status(404).send({ error: "Invalid Credentials" });
  }
};

const logoutAdmin = async (req, res) => {
  try {
    req.admin.tokens = req.admin.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.admin.save();
    res.send({ msg: "Logged OUT" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export {
  createAdmin,
  loginAdmin,
  logoutAdmin,
  updateAdmin,
};
