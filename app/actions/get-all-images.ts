"use server";

import prisma from "@/lib/prisma";

export const getAllImages = async () => {
  try {
    return await prisma.image.findMany({});
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener producto por slug");
  }
};
