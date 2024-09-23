"use client";
import { useState, useEffect } from "react";

function DateTime() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "http://127.0.0.1:5051/api/web-tools/current-date"
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
