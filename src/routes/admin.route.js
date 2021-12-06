import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  createAdmin,
  loginAdmin,
  logoutAdmin,
  updateAdmin,
} from "../controllers/admin.js";
import { Admin } from "../models/admin.js";

const AdminRouter = express.Router();

AdminRouter.post("/admin/signup", createAdmin);

AdminRouter.post("/admin/login", loginAdmin);

AdminRouter.post("/admin/logout", adminAuth, logoutAdmin);

AdminRouter.patch("/admin/me", adminAuth,  async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedupdates = [
    "pfiz",
    "pfizcount",
    "covi",
    "covicount",
    "cova",
    "covacount",
    "jans",
    "janscount",
    "mode",
    "modecount",
    "sino",
    "sinocount",
    "sico",
    "sicocount",
  ];

  const operation = updates.every((update) => allowedupdates.includes(update));
  if (!operation) {
    return res.status(400).send({
      error: "Invalid updates!",
    });
  }

  try {
    const admin = await Admin.findOne({
      _id: req.admin._id,
    });
    if (!admin) {
      return res.status(404).send({
        error: "Admin Not Found!",
      });
    }
    updates.forEach((update) => (admin[update] = req.body[update]));
    await admin.save();
    res.send({ admin });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

AdminRouter.get("/admin/me", adminAuth, async (req, res) => {
  try {
    const admins = await Admin.findOne({ _id: req.admin._id });
    res.send(admins);
  } catch (e) {
    res.send(e);
  }
});

AdminRouter.get("/home", async (req, res) => {
  try {
    const admins = await Admin.find({}).sort({centername:1});
    res.send(admins);
  } catch (e) {
    res.send(e);
  }
});
{
  /*
AdminRouter.patch(
  "/salestalent/me",
  salestalentAuth,
  async (req, res) => {
    const tobeUpdated = [
      "name",
      "email",
      "password",
      "salesskills",
      "lifeskills",
      "degree",
      "linkedin",
      "workexperience",
      "positions",
      "certifications",
      "extracur",
      "tagline",
    ];
    const updates = Object.keys(req.body);
    const validateUpdate = updates.every((update) =>
      tobeUpdated.includes(update)
    );

    if (!validateUpdate) {
      return res.status(400).send({ error: "Invalid update request" });
    }

    try {
      updates.forEach((update) => {
        req.salestalent[update] = req.body[update];
      });

      await req.salestalent.save();
      res.status(200).send(req.salestalent);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);
*/
}
//testing not done below this

export { AdminRouter };
