import React, { useState, useEffect } from "react";

const IPLocationFetcher = () => {
  const [city, setCity] = useState("Fetching...");

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        setCity(data.city);
        console.log('city', data.city);
      })
      .catch(() => setCity("Unable to fetch city"));
  }, []);

  return <h6>City: {city}</h6>;
};

export default IPLocationFetcher;
