import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TodoItem } from "./components/TodoItem";
import {
  selectTodos,
  fetchThunk,
  selectStatus,
  setFilter,
} from "./reducers/reducer";

export const App = () => {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const todos = useSelector(selectTodos);
  const status = useSelector(selectStatus);

  const submit = (e) => {
    e.preventDefault();
    if (!value.trim()) {
      return;
    }
    const id = Math.random().toString(36); //da numero aleatorio y lo convierte a string
    const todo = { title: value, completed: false, id };
    dispatch({ type: "todo/add", payload: todo });
    setValue("");
  };

  if (status.loading === "pending") {
    return <p>Cargando...</p>;
  }
  if (status.error === "rejected") {
    return <p>{status.error}</p>;
  }
  return (
    <div>
      <form onSubmit={submit}>
        <input value={value} onChange={(e) => setValue(e.target.value)} />
      </form>
      <button onClick={() => dispatch(setFilter("all"))}>Mostrar todos</button>
      <button onClick={() => dispatch(setFilter("complete"))}>Completos</button>
      <button onClick={() => dispatch(setFilter("incomplete"))}>
        Incompletos
      </button>
      <button onClick={() => dispatch(fetchThunk())}>Fetch</button>
      <ul>
        {todos.map((item) => (
          <TodoItem key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
};
