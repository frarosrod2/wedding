"use client";

import React, { useEffect, useState } from "react";
import { Image as ImageModel } from "../interfaces/Image";
import { Image, Space } from "antd";
import {
  DownloadOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";

export const Images = ({
  images,
  handleLike,
}: {
  images: ImageModel[];
  handleLike: (imageId: number, isSum: boolean) => void;
}) => {
  const [index, setIndex] = useState<number>();
  const [userVotes, setUserVotes] = useState<string[]>([]);
  const [tempImages, setTempImages] = useState<ImageModel[]>([]);

  useEffect(() => {
    setTempImages(images);
    const userVotesJSON = localStorage.getItem("votes") ?? "[]";
    setUserVotes(JSON.parse(userVotesJSON));
  }, [images]);

  const onDownload = () => {
    if (index == null) return;
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

  const onIconClick = (imageId: number, isSum: boolean) => {
    const isVoted = isImageVoted(imageId);
    if (!!isVoted) {
      const leftVotes =
        userVotes?.filter((votedImageId) => +votedImageId !== +imageId) ?? [];
      setUserVotes(leftVotes);
      localStorage.setItem("votes", JSON.stringify(leftVotes));
    } else {
      const userVotesClone = [...userVotes];
      userVotesClone.push(String(imageId));
      setUserVotes(userVotesClone);
      localStorage.setItem("votes", JSON.stringify([...userVotesClone]));
    }
    setTempImages(
      tempImages.map((tempImg) => {
        if (tempImg.id === imageId) {
          return {
            ...tempImg,
            totalVotes: isSum ? tempImg.totalVotes + 1 : tempImg.totalVotes - 1,
          };
        }
        return tempImg;
      })
    );
    handleLike(imageId, isSum);
  };

  function isImageVoted(imageId: number): boolean | null {
    console.log({ userVotes });
    return userVotes && Array.isArray(userVotes)
      ? !!userVotes.find((votedImageId) => +votedImageId === +imageId) ?? null
      : null;
  }

  return (
    <div className="flex justify-evenly flex-wrap items-stretch gap-y-12 gap-x-5 sm:gap-x-8 mt-20 mb-10 pb-20 px-4 sm:px-8 lg:px-20">
      <Image.PreviewGroup
        preview={{
          destroyOnClose: true,
          onVisibleChange: (
            visible: boolean,
            prevVisible: boolean,
            current: number
          ) => {
            setIndex(current);
          },
          onChange: (current, prev) => {
            setIndex(current);
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
        {tempImages?.map(({ id, url, date, totalVotes }) => (
          <div className="flex flex-col gap-3 image-cont" key={id}>
            <Image alt="Stored image" className="image-stored" src={url} />
            <span className="flex gap-3 votes-cont">
              <span>{totalVotes ?? 0}</span>
              {isImageVoted(id) ? (
                <HeartFilled
                  className="heart-filled"
                  onClick={() => onIconClick(id, false)}
                />
              ) : (
                <HeartOutlined onClick={() => onIconClick(id, true)} />
              )}
            </span>
          </div>
        ))}
      </Image.PreviewGroup>
    </div>
  );
};
