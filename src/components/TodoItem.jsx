import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCompleted } from "../reducers/reducer";

export const TodoItem = ({ item }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  return (
    <li
      style={{
        textDecoration: item.completed ? "line-through" : "none",
        cursor: "pointer",
      }}
      onClick={() => dispatch(setCompleted(item))}
    >
      {item.title}
    </li>
  );
};
