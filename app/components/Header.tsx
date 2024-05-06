"use client";

import { Button, message, Upload, Modal, Spin, Image } from "antd";
import { PlusCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { useState } from "react";
import { getBase64 } from "../utils/images";

const { Dragger } = Upload;

export type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export const Header = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const props: UploadProps = {
    multiple: true,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      console.log({ file: file });
      setFileList([...fileList, file]);

      return false;
    },
  };

  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files[]", file.originFileObj as File);
    });
    setFileList([]);
    setIsUploading(true);
    fetch("api/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        setFileList([]);
        message.success("Imagen/es subida/s correctamente");
      })
      .catch(() => {
        message.error("Ha habido un error");
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

  return (
    <>
      <div className="pt-20">
        <h1 className="pen-font text-7xl text-center animate-slide-out-bottom">
          Jesús & Noemí
        </h1>
        <div className="text-center mt-32 px-12 sm:px-28 lg:px-60">
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
                style={{ fontSize: "48px", color: "rgb(0 67 116)" }}
              />
            </p>
            <p className="ant-upload-text font-semibold">
              Pincha o arrastra las imágenes que desees añadir
            </p>
          </Dragger>
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={isUploading}
            style={{
              marginTop: 16,
              background: "rgba(191, 191, 191, 0.62)",
              color: "rgba(0, 0, 0,0.77)",
            }}
          >
            {isUploading ? "Subiendo" : "Subir imágenes"}
          </Button>
        </div>
      </div>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};
