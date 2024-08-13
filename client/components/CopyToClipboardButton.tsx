"use client";
import { useState } from "react";
import copy from "clipboard-copy";
import { FaRegCopy } from "react-icons/fa";
import { toast } from "sonner";

// Definice typu pro props
interface CopyToClipboardButtonProps {
  text: string;
}

const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({
  text,
}) => {
  const handleCopyClick = async () => {
    try {
      await copy(text);
      toast("Successfully copied. " + text);
    } catch (error) {
      console.error("Failed to copy text to clipboard", error);
    }
  };

  return (
    <div>
      <button onClick={handleCopyClick}>
        <FaRegCopy />
      </button>
    </div>
  );
};

export default CopyToClipboardButton;
