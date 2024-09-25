"use client";
import { useState, useEffect } from "react";

function DateTime() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "http://10.82.66.179:5050/api/web-tools/current-date"
      );
      const json = await response.json();
      setData(json);
    };

    fetchData();
  }, []);

  return (
    <div className="font-bold text-primary drop-shadow">
      {data ? (
        <h2>
          {data["day-word"]} {data["day-number"]} {data["month"]}
        </h2>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default DateTime;
