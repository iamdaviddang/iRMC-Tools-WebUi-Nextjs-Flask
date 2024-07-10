"use client";
import { showSelApi } from "@/actions/API_requests";
import { useState, useEffect } from "react";

const ShowSELTable = ({ userInput }) => {
  const [data, setData] = useState([]);

  const selData = async () => {
    try {
      const response = await showSelApi(userInput);
      if (response && response.data && Array.isArray(response.data.sel)) {
        setData(response.data.sel);
      } else {
        console.error("Unexpected API response format:", response);
        setData([]); 
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]); 
    }
  };

  useEffect(() => {
    selData();
  }, []);

  return (
    <div>
      {data.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>DateTime</th>
              <th>Severity</th>
              <th>Event</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.ID}>
                <td>{item.ID}</td>
                <td>{item.DateTime}</td>
                <td>{item.Severity}</td>
                <td>{item.Event}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default ShowSELTable;
