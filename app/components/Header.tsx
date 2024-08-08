"use client";

import { Button, message, Upload, Modal, Spin, Image, Select } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { startTransition, useCallback, useEffect, useState } from "react";
import { getBase64 } from "../utils/images";
import { Image as ImageModel } from "../interfaces/Image";
import { useRouter } from "next/navigation";
import { Images } from "./Images";
import { getAllImages } from "../actions/get-all-images";
import { vote } from "../actions/vote";

const { Dragger } = Upload;

export type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export const Header = () => {
  const router = useRouter();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [images, setImages] = useState<ImageModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date");

  const props: UploadProps = {
    multiple: true,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);

      return false;
    },
  };

  useEffect(() => {
    fetchImages(sortBy);
  }, []);

  const fetchImages = (sortBy: string) => {
    getAllImages(sortBy)
      .then((images: ImageModel[]) => {
        setIsLoading(false);
        console.log(images);
        setImages(images);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
        return [];
      });
  };

  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files[]", file.originFileObj as File);
    });
    setIsUploading(true);
    fetch("api/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.ok) {
          setFileList([]);
          startTransition(() => {
            // Refresh the current route and fetch new data from the server without
            // losing client-side browser or React state.
            router.refresh();
          });
          message.success(res.message);
          fetchImages(sortBy);
        } else {
          message.error(res.message);
        }
      })
      .catch(() => {
        message.error("Ha ocurrido un error");
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  const onChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  async function handleLike(imageId: number, isSum: boolean) {
    await vote(imageId, isSum)
      .then((_) => {
        fetchImages(sortBy);
      })
      .catch((error) => {
        console.log(error);
        message.error("Error al votar");
      });
  }

  const handleSort = (sortBy: string) => {
    setSortBy(sortBy);
    fetchImages(sortBy);
  };

  return (
    <>
      <div className="pt-16">
        <section className="px-2">
          <h1 className="pen-font text-7xl text-center animate-slide-out-bottom names">
            Jesús <span className="ampersand">&</span> Noemí
          </h1>
          <h2 className="text-3xl text-center mt-16 subtitle">
            Bienvenidos a nuestra boda
          </h2>
          <h2 className="text-2xl text-center mt-4 subtitle">
            10 de agosto de 2024
          </h2>
        </section>
        <div className="text-center mt-16 px-12 sm:px-28 lg:px-60">
          <Dragger
            {...props}
            listType="picture-card"
            onChange={onChange}
            onPreview={handlePreview}
            fileList={[...fileList]}
            className="upload-list-inline"
          >
            <p className="ant-upload-drag-icon">
              <PlusCircleOutlined
                className="h-16"
                style={{ fontSize: "3rem", color: "#6f4186" }}
              />
            </p>
            <p className="ant-upload-text font-semibold">
              Pincha o arrastra las imágenes que desees añadir
            </p>
          </Dragger>
          <Button
            className="upload-button"
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={isUploading}
          >
            {isUploading ? "Subiendo" : "Subir imágenes"}
          </Button>
        </div>
      </div>
      {isLoading && (
        <span className="flex mt-20 justify-center pb-10">Cargando...</span>
      )}
      {!isLoading && images && (
        <>
          <div className="flex justify-end items-center mt-10 px-6 sm:px-12 lg:px-24">
            <span>Ordenar por:&nbsp;</span>
            <Select
              defaultValue="date"
              style={{ width: 120 }}
              onChange={handleSort}
              options={[
                { value: "date", label: "Fecha" },
                { value: "totalVotes", label: "Likes" },
              ]}
            />
          </div>
          <Images images={images} handleLike={handleLike} />
        </>
      )}
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
          alt="Preview image"
        />
      )}
    </>
  );
};
