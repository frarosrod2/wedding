"use server";

import prisma from "@/lib/prisma";

export const getAllImages = async (sortBy: string) => {
  console.log({ sortBy });
  try {
    return await prisma.image.findMany({
      orderBy: {
        [sortBy ?? "date"]: "desc",
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener imagenes");
  }
};
