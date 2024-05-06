import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config(process.env.CLOUDINARY_URL ?? "");

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const images = data.getAll("files[]") as File[];
    console.log({ data: JSON.stringify(images) });
    images.forEach(async (image) => {
      console.log({ image });
      if (!image)
        return NextResponse.json({
          ok: false,
          message: `No existe imagen`,
        });
      const buffer = await image.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString("base64");
      const newURL = cloudinary.uploader
        .upload(`data:image/png;base64,${base64Image}`, { folder: "wedding" })
        .then((r) => r.secure_url)
        .catch((error) => {
          return NextResponse.json({
            ok: false,
            error,
          });
        });
      return NextResponse.json(newURL);
    });
    return NextResponse.json({
      ok: true,
      message: "No se han encontrado imágenes",
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error,
    });
  }
}
