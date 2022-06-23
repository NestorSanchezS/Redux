import { combineReducers } from "redux";

export const filterReducer = (state = "all", action) => {
  switch (action.type) {
    case "filter/set":
      return action.payload;
    default:
      return state;
  }
};

const initialFetching = { loading: "idle", error: null };
export const fetchingReducer = (state = initialFetching, action) => {
  switch (action.type) {
    case "todos/pending": {
      return { ...state, loading: "pending" };
    }
    case "todos/fulfilled": {
      return { ...state, loading: "succede" };
    }
    case "todos/error": {
      return { error: "error", loading: "rejected" };
    }
    default: {
      return state;
    }
  }
};

export const todosReducer = (state = [], action) => {
  switch (action.type) {
    case "todos/fulfilled": {
      return action.payload;
    }
    case "todo/add": {
      return state.concat({ ...action.payload });
    }
    case "todo/complete": {
      const newTodo = state.map((todo) => {
        if (todo.id === action.payload.id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });
      return newTodo;
    }
    default:
      return state;
  }
};

export const reducer = combineReducers({
  todos: combineReducers({
    entities: todosReducer,
    status: fetchingReducer,
  }),
  filter: filterReducer,
});

export const selectTodos = (state) => {
  const {
    todos: { entities },
    filter,
  } = state;

  if (filter === "complete") {
    return entities.filter((todo) => todo.completed);
  }
  if (filter === "incomplete") {
    return entities.filter((todo) => !todo.completed);
  }
  return entities;
};

export const selectStatus = (state) => state.todos.status;

export const asyncMiddleware = (store) => (next) => (action) => {
  if (typeof action === "function") {
    return action(store.dispatch, store.getState);
  }
  return next(action);
};

const setPending = () => ({ type: "todos/pending" });

const setFulfiled = (payload) => ({
  type: "todos/fulfilled",
  payload,
});

const setError = (error) => ({ type: "todos/error", error: error.message });

export const setCompleted = (payload) => ({ type: "todos/complete", payload });

export const setFilter = (payload) => ({ type: "filter/set", payload });

export const fetchThunk = () => async (dispatch) => {
  dispatch(setPending());
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await response.json();
    const todos = data.slice(0, 10);
    dispatch(setFulfiled(todos));
  } catch (error) {
    dispatch(setError());
  }
};
