export const rebootApi = async (userInput) => {
  const url = "http://10.82.66.179:5050/api/web-tools/reboot-power-on/";
  const userData = {
    userData: userInput.toString(2),
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};

export const powerOffApi = async (userInput) => {
  const url = "http://10.82.66.179:5050/api/web-tools/power-off/";
  const userData = {
    userData: userInput.toString(2),
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};

export const clearSelApi = async (userInput) => {
  const url = "http://10.82.66.179:5050/api/web-tools/clear-sel/";
  const userData = {
    userData: userInput.toString(2),
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};

export const getInfoApi = async (userInput) => {
  const url = "http://10.82.66.179:5050/api/web-tools/get-info/";
  const userData = {
    userData: userInput.toString(2),
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};

export const getSdCardCheckApi = async (userInput) => {
  const url = "http://10.82.66.179:5050/api/web-tools/sd-card-check/";
  const userData = {
    userData: userInput.toString(2),
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};

export const showSelApi = async (userInput) => {
  const url = "http://10.82.66.179:5050/api/web-tools/sel/";
  const userData = {
    userData: userInput.toString(2),
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};

export const reportApi = async (userInput) => {
  const url = "http://10.82.66.179:5050/api/web-tools/report/";
  const userData = {
    userInput,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInput),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};

export const getFwApi = async (userInput) => {
  const url = "http://10.82.66.179:5050/api/web-tools/fw/";
  const userData = {
    userData: userInput.toString(2),
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};

export const resetBMCApi = async (userInput) => {
  const url = "http://10.82.66.179:5050/api/web-tools/reset-irmc/";
  const userData = {
    userData: userInput.toString(2),
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Fetch data failed");
    return null;
  }
};
