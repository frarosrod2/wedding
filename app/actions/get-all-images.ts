"use server";

import prisma from "@/lib/prisma";
import { Image } from "../interfaces/Image";

export const getAllImages = async () => {
  try {
    return await prisma.image.findMany({
      orderBy: { totalVotes: "desc" },
    }) as Image[];
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener producto por slug");
  }
};
