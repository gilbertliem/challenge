import React from "react";
import styles from "./SearchBar.module.css";

export default function SearchBar({ handleSubmit, handleChange }) {
  return (
    <>
      <div className={styles.row}>
        <form action="search" onSubmit={handleSubmit} className={styles.search}>
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
    </>
  );
}
