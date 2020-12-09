import React, { useState, useEffect } from "react";
import fetchJsonp from "fetch-jsonp";
import styles from "./List.module.css";
import loading from "../Assets/loading.gif";

export default function List() {
  const [list, setList] = useState([]);
  const [inputValue, setInputValue] = useState("random");
  const [isLoading, setIsLoading] = useState(false);
  const [PostPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState([]);

  const lastPostIndex = currentPage * PostPerPage;
  const firstPostIndex = lastPostIndex - PostPerPage;
  const currentPost = list.slice(firstPostIndex, lastPostIndex);

  useEffect(() => {
    pictureData();
  }, []);

  useEffect(() => {
    changePage();
  }, [list]);

  const pictureData = () => {
    setIsLoading(true);
    fetchJsonp(
      `https://api.flickr.com/services/feeds/photos_public.gne?lang=en-us&format=json&tags=""`,
      { jsonpCallback: "jsoncallback" }
    )
      .then((response) => response.json())
      .then((result) => {
        setList(result.items);
        setIsLoading(false);
      })
      .catch(() => {
        alert("Please reload the page!");
        // console.log("error");
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
        // console.log(list);
        setIsLoading(false);
      })
      .catch(() => {
        alert("Please use another keyword!");
        // console.log("error");
        setIsLoading(false);
      });
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
    if (e.target.value === "") {
      setInputValue("random");
    }
    // console.log(e.target.value);
  };

  const numberList = [];
  const changePage = () => {
    for (let i = 1; i <= Math.ceil(list.length / PostPerPage); i++) {
      numberList.push(`${i}`);
      // console.log(numberList);
      setPageNumbers(numberList);
    }
    // console.log(pageNumbers);
  };

  const paginate = (number) => {
    setCurrentPage(number);
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
            {currentPost.length >= 0
              ? currentPost.map((items, i) => {
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
          <div className={styles.page}>
            {pageNumbers.length > 0
              ? pageNumbers.map((number) => {
                  return (
                    <ul>
                      <li
                        key={number}
                        className={styles.pagebtn}
                        onClick={() => paginate(number)}
                      >
                        {number}
                      </li>
                    </ul>
                  );
                })
              : ""}
          </div>
        </div>
      </div>
    </>
  );
}
