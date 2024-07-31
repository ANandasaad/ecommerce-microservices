import express from "express";
const router = express.Router();

router.post("/signIn", (req, res) => {
  res.send({
    message: "You have been signed in",
  });
});

export default router;
