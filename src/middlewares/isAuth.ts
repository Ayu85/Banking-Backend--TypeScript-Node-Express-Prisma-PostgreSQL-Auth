import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { client } from "..";

export const isAuth = async(
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    // Retrieve token from cookies
    const token = req.cookies.token;
    if (!token)
      return res.status(400).json({ msg: "No Token Provided", success: false });

    // Ensure JWT_SECRET exists in environment variables
    const secret = process.env.JWT_SECRET;
    if (!secret)
      return res.status(400).json({ msg: "Missing JWT_SECRET in environment" });

    // Verify and decode the token
    //@ts-ignore
    const decoded=jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ msg: "Invalid or Expired Token", success: false });
      }
      // Attach the decoded user information to the request object
      req.user = decoded;  // Store decoded data (like userId) in req.user
      next();  // Proceed to the next middleware/handler
    });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error", success: false });
  }
};
