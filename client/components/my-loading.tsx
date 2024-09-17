import Image from "next/image";
import React from "react";

const MyLoading = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <Image src="/loading.svg" alt="loading" height={200} width={200} />
      <p className="text-gray-400">
        This action can take up to 10 minutes. Please do not close the page.
      </p>
    </div>
  );
};

export default MyLoading;
