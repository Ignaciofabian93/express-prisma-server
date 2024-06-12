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

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    if (!users) return res.status(404).json({ error: "No users found" });

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ user });
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
    const { name, photo } = req.body;

    if (!name && !photo) return res.status(400).json({ error: "Please provide valid values" });

    const user = await prisma.user.update({
      where: { id },
      data: { name, photo },
    });

    if (!user) return res.status(500).json({ error: "Error updating user" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.delete({ where: { id } });

    if (!user) return res.status(500).json({ error: "Error deleting user" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
};
