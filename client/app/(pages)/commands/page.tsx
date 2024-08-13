import CopyToClipboardButton from "@/components/CopyToClipboardButton";
import React from "react";

const Page = () => {
  return (
    <div className="flex">
      <div className="ml-10 mt-10 shadow-md w-max">
        <div className="h-[40px] w-[400px] bg-primary items-center flex rounded-t-md">
          <h2 className="p-3 font-bold text-white">iRMC reset to default</h2>
        </div>
        <div className="h-max w-[400px] border flex flex-col gap-3">
          <div className="flex gap-3 items-center pl-3 pt-3">
            <p className="">echo KrResetToDefault=2 {">"} i.ini</p>
            <CopyToClipboardButton text="echo KrResetToDefault=2 > i.ini" />
          </div>
          <div className="flex gap-3">
            <p className="pl-3 pb-3">./IPMIVIEW64 ini=i.ini</p>
            <CopyToClipboardButton text="./IPMIVIEW64 ini=i.ini" />
          </div>
        </div>
      </div>
      <div className="ml-10 mt-10 shadow-md w-max border">
        <div className="h-[40px] w-[400px] bg-primary  items-center flex rounded-t-md">
          <h2 className="p-3 font-bold text-white">Change iRMC Password</h2>
        </div>
        <div className="h-max w-[400px]  flex flex-col gap-3">
          <div className="flex items-center">
            <p className="p-3">ipmitool user set password 2 Password@123</p>
            <CopyToClipboardButton text="ipmitool user set password 2 Password@123" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
