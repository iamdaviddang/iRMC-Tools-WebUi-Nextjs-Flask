"use client";
import { useState } from "react";
import copy from "clipboard-copy";
import { FaRegCopy } from "react-icons/fa";
import { toast } from "sonner";

const CopyToClipboardButton = ({ text }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = async () => {
    try {
      await copy(text);
      setIsCopied(true);
      toast("IP address has been copied. " + text);
    } catch (error) {
      console.error("Failed to copy text to clipboard", error);
    }
  };

  return (
    <div>
      <button onClick={handleCopyClick}>
        {isCopied ? "Copied!" : <FaRegCopy />}
      </button>
    </div>
  );
};

export default CopyToClipboardButton;
