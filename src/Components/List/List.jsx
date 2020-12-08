import React, { useState, useEffect } from "react";
import fetchJsonp from "fetch-jsonp";
import styles from "./List.module.css";
import loading from "../Assets/loading.gif";

export default function List() {
  const [list, setList] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    pictureData();
  }, []);

  const pictureData = () => {
    const encodeQuery = encodeURIComponent(inputValue);
    setIsLoading(true);
    fetchJsonp(
      `https://api.flickr.com/services/feeds/photos_public.gne?lang=en-us&format=json&tags=""`,
      { jsonpCallback: "jsoncallback" }
    )
      .then((response) => response.json())
      .then((result) => {
        setList(result.items);
        console.log(list);
        setIsLoading(false);
      })
      .catch(() => {
        console.log("error");
        setIsLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const encodeQuery = encodeURIComponent(inputValue);
    setIsLoading(true);
    fetchJsonp(
      `https://api.flickr.com/services/feeds/photos_public.gne?lang=en-us&format=json&tags=${encodeQuery}`,
      { jsonpCallback: "jsoncallback" }
    )
      .then((response) => response.json())
      .then((result) => {
        setList(result.items);
        console.log(list);
        setIsLoading(false);
      })
      .catch(() => {
        console.log("error");
        setIsLoading(false);
      });
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
    // console.log(e.target.value);
  };

  return (
    <>
      <div>
        <div className={styles.row}>
          <form
            action="search"
            onSubmit={handleSubmit}
            className={styles.search}
          >
            <input
              type="text"
              name="search"
              id="search"
              onChange={handleChange}
              placeholder="Write your keywords here.."
            />
            <input type="submit" value="search" className={styles.btn} />
          </form>
        </div>
        <div className={styles.container}>
          <div className={styles.keyword}>Search for: {inputValue}</div>
          <ul className={styles.list}>
            {list.length >= 0
              ? list.map((items, i) => {
                  if (isLoading) {
                    return (
                      <li key={i}>
                        <img
                          src={loading}
                          alt="loading"
                          className={styles.image}
                        />
                      </li>
                    );
                  } else {
                    return (
                      <li key={i}>
                        <img
                          src={`${items.media.m}`}
                          alt={items.title}
                          className={styles.image}
                        />
                      </li>
                    );
                  }
                })
              : "No Pictures Available"}
          </ul>
        </div>
      </div>
    </>
  );
}
