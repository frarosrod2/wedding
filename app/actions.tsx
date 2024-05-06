"use server";

import { UploadFile } from "antd";
import { v2 as cloudinary } from "cloudinary";

export const saveImages = async (image: UploadFile<any>) => {
  try {
    cloudinary.config({
      cloud_name: "daohtolsp",
      api_key: "578598779672652",
      api_secret: "oNzTuM1k1bULSozjRrgjyKFp7mE",
    });
    if (!image?.originFileObj) return;
    const buffer = await image.originFileObj?.arrayBuffer();
    console.log({ buffer });
    const base64Image = Buffer.from(buffer).toString("base64");
    console.log({ base64Image });


    const newURL = cloudinary.uploader
      .upload(`data:image/png;base64,${base64Image}`)
      .then((r) => r.secure_url)
      .catch((e) => {
        console.log(e);
      });
    return {
      ok: true,
      image: newURL,
    };
  } catch (error) {
    return {
      ok: false,
      message: "Revisar los logs, no se pudo actualizar/crear",
    };
  }
};
