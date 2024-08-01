import {
  areCredentialsStored,
  clearCredentials,
  getCredentials,
  saveCredentials,
} from "@/localStorage/functions";
import React from "react";
import { MdConnectedTv } from "react-icons/md";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const ConnectToSsh = (props) => {
  function encodeBase64(string) {
    return btoa(string);
  }
  function getEncodedPassword() {
    const password = localStorage.getItem("password");
    return password ? encodeBase64(password) : null;
  }
  const [encodedPassword, setEncodedPassword] = useState(null);
  useEffect(() => {
    const encoded = getEncodedPassword();
    setEncodedPassword(encoded);
  }, []);
  const connect = () => {
    if (areCredentialsStored()) {
      const credentials = getCredentials();
      const username = credentials.username;
      const password = encodedPassword;
      window.open(
        `http://172.25.32.4/ssh/?hostname=${props.ip}&username=${username}&password=${password}&command=screen%20-x&#fontsize=16&title=${props.nameofserver}`,
        "_blank"
      );
    } else {
      toast(
        "You have not credentials saved. Go to the setting and save them please. "
      );
    }
  };
  return (
    <div>
      <MdConnectedTv className="cursor-pointer" onClick={connect} />
    </div>
  );
};

export default ConnectToSsh;
