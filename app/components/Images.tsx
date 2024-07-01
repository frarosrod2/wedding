import React, { useState } from "react";
import { Image as ImageModel } from "../interfaces/Image";
import { Image, Space } from "antd";
import {
  DownloadOutlined,
  UndoOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";

export const Images = ({ images }: { images: ImageModel[] }) => {
  const [index, setIndex] = useState<number>();

  const onDownload = () => {
    if (!index) return;
    const selectedImage = images[index];
    fetch(selectedImage?.url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.download = "image.png";
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        link.remove();
      });
  };

  const onTouchStart = () => {
    console.log("SWIPE");
  };
  const onTouchMove = () => {
    console.log("MOVE");
  };
  const onTouchEnd = () => {
    console.log("END");
  };

  return (
    <div className="flex justify-evenly flex-wrap items-center gap-y-12 gap-x-5 sm:gap-x-8 mt-20 pb-20 px-4 sm:px-8 lg:px-20">
      <Image.PreviewGroup
        preview={{
          destroyOnClose: true,
          onVisibleChange: (
            visible: boolean,
            prevVisible: boolean,
            current: number
          ) => {
            setIndex(current);
            console.log({ current });
          },
          onChange: (current, prev) => {
            setIndex(current);
            console.log(`current index: ${current}, prev index: ${prev}`);
          },
          toolbarRender: (
            _,
            {
              transform: { scale },
              actions: {
                onFlipY,
                onFlipX,
                onRotateLeft,
                onRotateRight,
                onZoomOut,
                onZoomIn,
              },
            }
          ) => (
            <Space size={12} className="toolbar-wrapper">
              <DownloadOutlined onClick={onDownload} />
              <SwapOutlined rotate={90} onClick={onFlipY} />
              <SwapOutlined onClick={onFlipX} />
              <RotateLeftOutlined onClick={onRotateLeft} />
              <RotateRightOutlined onClick={onRotateRight} />
              <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
              <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
            </Space>
          ),
        }}
      >
        {images?.map(({ id, url, date }) => (
          <Image className="stored-image" src={url} key={id} />
        ))}
      </Image.PreviewGroup>
    </div>
  );
};
