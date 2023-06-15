import React, { useEffect, useState } from "react";
import "./Task.css";

function convertTimeToAgo(timestamp) {
  const now = new Date();
  const uploadTime = new Date(timestamp);
  const timeDiff = now.getTime() - uploadTime.getTime();

  // Calculate the difference in days, hours, and minutes
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutesDiff = Math.floor(timeDiff / (1000 * 60));

  if (daysDiff > 0) {
    return `${daysDiff} day${daysDiff > 1 ? "s" : ""} ago`;
  } else if (hoursDiff > 0) {
    return `${hoursDiff} hour${hoursDiff > 1 ? "s" : ""} ago`;
  } else {
    return `${minutesDiff} minute${minutesDiff > 1 ? "s" : ""} ago`;
  }
}

function Tasks() {
  const [showOptions, setShowOptions] = useState(false);
  const [data, setData] = useState([]);
  const [editedTasks, setEditedTasks] = useState({});
  const [status, setStatus] = useState();

  const getData = async () => {
    const response = await fetch("/gettask");
    const json = await response.json();
    if (json.msg === "SUCCESS") {
      setData(json.task);
      console.log(json.task.updatedAt);
    }
  };

  const handleOptionsClick = () => {
    setShowOptions(!showOptions); // Toggle options popup
  };

  const handleCheckboxChange = async (event, index) => {
    const { checked } = event.target;

    const response = await fetch("/edittask", {
      method: "PUT",
      body: JSON.stringify({
        id: data[index]._id,
        status: checked,
        task:data[index].Task
      }),
      headers: { "Content-type": "application/json" },
    });

    const json = await response.json();
    if (json.msg === "SUCCESS") {
      // Update the data state with the modified status
      setData((prevData) => {
        const newData = [...prevData];
        newData[index].Status = checked;
        return newData;
      });
    }
  };

  const handleEditClick = (index) => {
    setEditedTasks((prevEditedTasks) => {
      if (prevEditedTasks[index]) {
        // Clear existing edited task if present
        const newEditedTasks = { ...prevEditedTasks };
        delete newEditedTasks[index];
        return newEditedTasks;
      } else {
        // Set edited task for the specific index
        return {
          ...prevEditedTasks,
          [index]: {
            task: data[index].Task,
            status: data[index].Status,
          },
        };
      }
    });
  };

  const handleEditSubmit = async (event, index) => {
    event.preventDefault();

    const editedTask = editedTasks[index];

    const response = await fetch("/edittask", {
      method: "PUT",
      body: JSON.stringify({
        id: data[index]._id,
        status: editedTask.status,
        task: editedTask.task,
      }),
      headers: { "Content-type": "application/json" },
    });

    const json = await response.json();
    if (json.msg === "SUCCESS") {
      // Clear the edited task for the specific index
      setEditedTasks((prevEditedTasks) => {
        const newEditedTasks = { ...prevEditedTasks };
        delete newEditedTasks[index];
        return newEditedTasks;
      });
      window.location.reload();
    }
  };

  const handleDeleteClick = async (index) => {
    const id = data[index]._id;
  
    const response = await fetch("/deletetask", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-type": "application/json" },
    });
  
    const json = await response.json();
    if (json.msg === "SUCCESS") {
      // Remove the deleted task from the data state
      setData((prevData) => {
        const newData = [...prevData];
        newData.splice(index, 1);
        return newData;
      });
    }
  };
  

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="taskContainer">
      <div className="subTaskContainer">
        {data.map((task, index) => (
          <div className="taskAndEditForm" key={index}>
            <div className="tasksCheckbox">
              <input
                type="checkbox"
                defaultChecked={task.Status}
                onChange={(event) => handleCheckboxChange(event, index)}
              />
              <label className="labels">
                <div className="taskLabels" style={task.Status === 1 ? { opacity: 0.3 } : {}}>
                  <div className="taskDetails">{task.Task}</div>
                  <div className="taskTimeDates">
                    <div>{convertTimeToAgo(task.updatedAt)}</div>
                  </div>
                </div>
                <div className="editDoneButton">
                  <div
                    className="button1"
                    onClick={() => handleEditClick(index)}
                  >
                    Edit
                  </div>
                  <div className="button2"
                    onClick={()=>handleDeleteClick(index)}
                  >Delete</div>
                </div>
              </label>
            </div>
            <div
              className={`editFormContainer ${
                editedTasks[index] ? "active" : ""
              }`}
            >
              <form
                className="editForm"
                onSubmit={(event) => handleEditSubmit(event, index)}
              >
                <input
                  type="text"
                  value={
                    editedTasks[index] ? editedTasks[index].task : task.Task
                  }
                  placeholder="Edit Task"
                  onChange={(e) => {
                    setEditedTasks((prevEditedTasks) => ({
                      ...prevEditedTasks,
                      [index]: {
                        ...prevEditedTasks[index],
                        task: e.target.value,
                      },
                    }));
                  }}
                />

                <button>Edit</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;
