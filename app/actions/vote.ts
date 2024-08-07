"use server";

import prisma from "@/lib/prisma";

export const vote = async (imageId: number, isSum: boolean) => {
  try {
    const res = await prisma.image.update({
      where: {
        id: imageId,
      },
      data: {
        totalVotes: { increment: isSum ? +1 : -1 },
      },
    });
    return res;
  } catch (error) {
    console.log(error);
    throw new Error("Error al votar");
  }
};
