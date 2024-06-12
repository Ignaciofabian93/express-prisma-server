import { Request, Response } from "express";
import { hash, compare, genSalt } from "bcrypt";
import { sign } from "jsonwebtoken";
import prisma from "../client/prismaClient";

export const authUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Please provide email and password" });

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await compare(password, user.password);

    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    const token = sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, photo } = req.body;

    if (!name || email || password)
      return res.status(400).json({ error: "Please provide name, email and password" });

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, photo },
    });
    if (!user) return res.status(500).json({ error: "Error creating user" });

    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, photo } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { name, email, password, photo },
    });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error });
  }
};
