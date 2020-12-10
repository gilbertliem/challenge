import React, { useState, useEffect } from "react";
import fetchJsonp from "fetch-jsonp";
import styles from "./List.module.css";
import loading from "../Assets/loading.gif";
import SearchBar from "../SearchBar/SearchBar";
import Modal from "react-modal";

export default function List() {
  const [list, setList] = useState([]);
  const [inputValue, setInputValue] = useState("random");
  const [isLoading, setIsLoading] = useState(false);
  const [PostPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [display, setDisplay] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const lastPostIndex = currentPage * PostPerPage;
  const firstPostIndex = lastPostIndex - PostPerPage;
  const currentPost = list.slice(firstPostIndex, lastPostIndex);

  // MODAL STYLE //
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  Modal.setAppElement("#root");

  // USEEFFECT //

  useEffect(() => {
    pictureData();
  }, []);

  useEffect(() => {
    changePage();
  }, [list]);

  // FUNCTIONS //

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
        setCurrentPage(1);
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

  // PAGINATION //
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

  // MODAL //
  const openModal = (e) => {
    let id = e.target.id;
    let detail = currentPost.filter((item) => item.author_id === id);
    setDisplay(detail);
    // console.log(id);
    setModalOpen(true);
  };

  const requestClose = () => setModalOpen(false);

  return (
    <>
      <div>
        <SearchBar handleSubmit={handleSubmit} handleChange={handleChange} />
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
                          id={items.author_id}
                          src={`${items.media.m}`}
                          alt={items.title}
                          className={styles.image}
                          onClick={openModal}
                        />
                      </li>
                    );
                  }
                })
              : "No Pictures Available"}
            <Modal
              isOpen={modalOpen}
              shouldCloseOnOverlayClick={true}
              onRequestClose={requestClose}
              style={customStyles}
            >
              {display.length > 0
                ? display.map((item, i) => {
                    return (
                      <li key={i} className={styles.modal}>
                        <img
                          src={`${item.media.m}`}
                          alt={item.title}
                          id={item.author_id}
                        />
                      </li>
                    );
                  })
                : ""}
            </Modal>
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
