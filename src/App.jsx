import { useState, useEffect } from "react";
import TitleBar from "./components/titleBar.jsx";
import { v4 as uuidv4 } from "uuid";
import { MdDelete, MdEdit, MdCheckCircle, MdCancel } from "react-icons/md";
import { FiCheckSquare, FiSquare } from "react-icons/fi";

function App() {
  const [todo, setTodo] = useState(""); /* Input text state for todos */
  const [todos, setTodos] = useState([]); /* Array to hold the list of todos */
  const [showFinished, setShowFinished] =
    useState(false); /* Show finished todos toggle */
  const [editingId, setEditingId] =
    useState(null); /* Track which todo is being edited */

  useEffect(() => {
    const todosString = localStorage.getItem("todos");
    if (todosString) {
      setTodos(JSON.parse(todosString));
    }
    const savedShowFinished = localStorage.getItem("showFinished");
    if (savedShowFinished !== null) {
      setShowFinished(JSON.parse(savedShowFinished));
    }
  }, []);

  const save = (todosToSave) => {
    localStorage.setItem("todos", JSON.stringify(todosToSave));
  };

  const saveShowFinished = (value) => {
    localStorage.setItem("showFinished", JSON.stringify(value));
  };

  const handleDelete = (e, id) => {
    const updatedTodos = todos.filter((item) => item.id !== id);
    setTodos(updatedTodos);
    save(updatedTodos);
    if (editingId === id) {
      setEditingId(null);
      setTodo("");
    }
  };

  const handleEdit = (e, id) => {
    const t = todos.find((item) => item.id === id);
    if (t) {
      setTodo(t.todo);
      setEditingId(id);
    }
  };

  const handleAdd = () => {
    const trimmedTodo = todo.trim();
    if (trimmedTodo === "") return;

    if (editingId) {
      // Update existing todo
      const updatedTodos = todos.map((item) =>
        item.id === editingId ? { ...item, todo: trimmedTodo } : item
      );
      setTodos(updatedTodos);
      save(updatedTodos);
      setEditingId(null);
      setTodo("");
    } else {
      // Add new todo
      const newTodos = [
        ...todos,
        { id: uuidv4(), todo: trimmedTodo, isCompleted: false },
      ];
      setTodos(newTodos);
      save(newTodos);
      setTodo("");
    }
  };

  const handleChange = (e) => {
    setTodo(e.target.value); /* Update the todo state with input value */
  };

  const handleCompleted = (id) => {
    const updatedTodos = todos.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setTodos(updatedTodos);
    save(updatedTodos);
  };

  const toggleFinished = (e) => {
    const newVal = !showFinished;
    setShowFinished(newVal);
    saveShowFinished(newVal);
  };

  return (
    <>
      <header>
        <TitleBar />
      </header>

      <main className="flex flex-col justify-center items-center">
        <div className="add-todo mt-4 flex w-[96vw]">
          <input
            type="text"
            placeholder="Write your todo here..."
            className="border border-gray-300 rounded-lg p-2 w-[88vw] "
            onChange={handleChange}
            value={todo}
          />
          <button
            className="bg-blue-600 text-white rounded-lg px-4 py-2 ml-2 hover:bg-blue-500 w-[8vw] disabled:bg-gray-500 "
            onClick={handleAdd}
            title={editingId ? "Update Todo" : "Add Todo"}
            disabled={todo.trim() === ""}
          >
            {editingId ? "Update Todo" : "Add Todo"}
          </button>
        </div>
        <div className="flex items-center justify-start w-[96vw] mt-4 gap-2">
          <input
            type="checkbox"
            checked={showFinished}
            onChange={toggleFinished}
          />
          Show Completed Todos
        </div>

        <div className="todo-list bg-blue-100 rounded-lg p-4 my-4 w-[96vw] min-h-[77vh]">
          {todos.length === 0 && (
            <div className="flex justify-center items-center min-h-[73vh]">
              <h1 className="text-gray-600 text-7xl font-bold opacity-25">
                No todos available
              </h1>
            </div>
          )}
          {todos.map((item) => {
            return (
              (showFinished || !item.isCompleted) && (
                <div
                  className="todo flex items-center justify-between bg-blue-300 p-3 rounded-lg my-2.5"
                  key={item.id}
                >
                  <span
                    className={`text-gray-800 ${
                      item.isCompleted ? "line-through" : ""
                    } w-[85%] break-words whitespace-normal`}
                  >
                    {item.todo}
                  </span>

                  <div className="todo-buttons flex gap-2.5 w-[15%] justify-end flex-shrink-0">
                    {/* Delete Button */}
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition duration-200 flex items-center justify-center"
                      onClick={(e) => handleDelete(e, item.id)}
                      title="Delete"
                      aria-label="Delete Todo"
                    >
                      <MdDelete size={20} />
                    </button>

                    {/* Edit Button */}
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition duration-200 flex items-center justify-center"
                      onClick={(e) => handleEdit(e, item.id)}
                      title="Edit"
                      aria-label="Edit Todo"
                    >
                      <MdEdit size={20} />
                    </button>

                    {/* Complete/Incomplete Toggle */}
                    <button
                      className={`p-2 rounded-lg transition duration-200 flex items-center justify-center ${
                        item.isCompleted
                          ? "bg-gray-500 hover:bg-gray-600 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                      onClick={() => handleCompleted(item.id)}
                      title={
                        item.isCompleted ? "Mark Incomplete" : "Mark Complete"
                      }
                      aria-label="Toggle Complete"
                    >
                      {item.isCompleted ? (
                        <MdCancel size={20} />
                      ) : (
                        <MdCheckCircle size={20} />
                      )}
                    </button>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </main>
    </>
  );
}

export default App;
