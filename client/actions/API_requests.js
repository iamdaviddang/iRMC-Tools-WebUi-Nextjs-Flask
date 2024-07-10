export const rebootApi = async (userInput) => {
  const url = "http://172.25.177.2:5050/api/web-tools/reboot-power-on/";
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
    return data; // Return the parsed JSON response
  } catch (error) {
    return null; // Or return a specific error object
  }
};

export const powerOffApi = async (userInput) => {
  const url = "http://172.25.177.2:5050/api/web-tools/power-off/";
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
  const url = "http://172.25.177.2:5050/api/web-tools/clear-sel/";
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
  const url = "http://172.25.177.2:5050/api/web-tools/get-info/";
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
  const url = "http://172.25.177.2:5050/api/web-tools/sd-card-check/";
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
  const url = "http://172.25.177.2:5050/api/web-tools/sel/";
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
