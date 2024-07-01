import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import prisma from "@/lib/prisma";

cloudinary.config(process.env.CLOUDINARY_URL ?? "");

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const images = data.getAll("files[]") as File[];
    const imagesPromises = images.map(async (image) => {
      const buffer = await image.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString("base64");
      return cloudinary.uploader
        .upload(`data:image/png;base64,${base64Image}`, { folder: "wedding" })
        .then((r) => r.secure_url)
        .catch((error) => {
          return error;
        });
    });
    const uploadedImages = await Promise.all(imagesPromises);
    if (!uploadedImages) {
      return NextResponse.json(
        {
          ok: false,
          message: "No se pudo cargar las imágenes",
        },
        { status: 404 }
      );
    }

    await prisma.image.createMany({
      data: uploadedImages.map((image) => ({
        url: image!,
        date: new Date(),
      })),
    });
    return NextResponse.json(
      {
        ok: true,
        message: "Imágen/es subida/s correctamente",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log({ error });
    return NextResponse.json(
      {
        ok: false,
        message: "Ha ocurrido un error",
      },
      { status: 500 }
    );
  }
}
