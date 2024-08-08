import Image from "next/image";
import React from "react";

const MyLoading = () => {
  return (
    <div>
      <Image src="/loading.svg" alt="loading" height={200} width={200} />
    </div>
  );
};

export default MyLoading;
