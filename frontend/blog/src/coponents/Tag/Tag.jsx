import React from "react";
import css from "./styles.module.css";

const Tag = ({ tag }) => {
  return <span className={css.tag}>{tag}</span>;
};

export default Tag;
