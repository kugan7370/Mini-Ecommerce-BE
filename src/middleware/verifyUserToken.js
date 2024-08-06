import jwt from "jsonwebtoken";

const verifyUserToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Access Denied" });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access Denied" });
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid Token" });
  }
};

export default verifyUserToken;
