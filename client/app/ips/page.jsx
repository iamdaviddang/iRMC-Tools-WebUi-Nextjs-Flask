"use client";
import CopyToClipboardButton from "@/components/CopyToClipboardButton";
import React from "react";

const page = () => {
  return (
    <div className="flex">
      <div className="ml-10 mt-10 shadow-md w-max">
        <div className="h-[40px] w-[400px] bg-primary items-center flex rounded-t-md">
          <h2 className="p-3 font-bold text-white">File Server for M7</h2>
        </div>
        <div className="h-[50px] w-[400px] flex gap-3 items-center">
          <p className="pl-3">172.25.1.244</p>
          <CopyToClipboardButton text="172.25.1.244" />
        </div>
      </div>

      <div className="ml-10 mt-10 shadow-md w-max">
        <div className="h-[40px] w-[400px] bg-primary items-center flex rounded-t-md">
          <h2 className="p-3 font-bold text-white">File Server for M6</h2>
        </div>
        <div className="h-[50px] w-[400px] flex gap-3 items-center">
          <p className="pl-3">172.25.1.243</p>
          <CopyToClipboardButton text="172.25.1.243" />
        </div>
      </div>

      <div className="ml-10 mt-10 shadow-md w-max">
        <div className="h-[40px] w-[400px] bg-primary items-center flex rounded-t-md">
          <h2 className="p-3 font-bold text-white">SAR / CPN</h2>
        </div>
        <div className="h-[50px] w-[400px] flex gap-3 items-center">
          <p className="pl-3">172.25.8.2</p>
          <CopyToClipboardButton text="172.25.8.2" />
        </div>
      </div>
    </div>
  );
};

export default page;
