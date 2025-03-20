  import React, { useState, useEffect } from "react";
  import { useNavigate, useParams } from "react-router-dom";
  import api from "../../api/axios";

  interface ProjectTask {
    id: number,
    name:string,
    is_done:boolean,
    project:number,
  }

  const ProjectEdit = () => {
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [tempUser, setTempUser] = useState("");
    const [users, setUsers] = useState<string[]>([]);
    const [deadLine, setDeadLine] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();
    const [tempTask, setTempTask] = useState("");
    const [rawTasks, setRawTasks] = useState<ProjectTask[]>([])

    useEffect(() => {
      const getData = async () => {
        try {
          const response = await api.get(`api/projects/${id}/`);
          setSubject(response.data.name);
          setDescription(response.data.description);
          const taskResponse = await api.get(`api/projects/${id}/tasks/`)
          setRawTasks(taskResponse.data)
          const newUsers: string[] = [];
          response.data.users_detail.forEach((element: any) => {
            if (!newUsers.includes(element.username)) {
              newUsers.push(element.username);
            }
          });
          setUsers(newUsers);
          setDeadLine(response.data.dead_line);
          setIsLoading(false);
        } catch (error) {
          setError("Failed to load project");
          setIsLoading(false);
          console.error(error);
        }
      };
      getData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await api.put(`api/projects/${id}/`, {
          name: subject,
          description: description,
          users: users,
          dead_line: deadLine,
        });
        navigate(-1);
      } catch (error: any) {
        if (error.response.data.non_field_errors[0] != ""){
          setError(error.response.data.non_field_errors[0])
          return
        }
        setError("Failed to update project");
        console.error(error);
      }
    };

    const handleDelete = async () => {
      if (window.confirm("Are you sure you want to delete this project?")) {
        try {
          await api.delete(`api/projects/${id}`);
          navigate("/");
        } catch (error) {
          setError("Failed to delete project");
          console.error(error);
        }
      }
    };

    const handleAddUser = () => {
      if (tempUser && !users.includes(tempUser)) {
        setUsers([...users, tempUser]);
        setTempUser("");
      }
    };

    const handleRemoveUser = (user: string) => {
      setUsers(users.filter((obj) => obj !== user));
    };

    const handleAddTask = async (e: any) => {
      e.preventDefault();
      // if (tempTask && !tasks.includes(tempTask)) {
      //   try {
      //     await api.post(`api/projects/${id}/tasks/`, { name: tempTask, is_done: false, project: id });
      //     setTasks([...tasks, tempTask]);
      //     setTempTask("");
      //   } catch (error) {
      //     setError("Failed to add task")
      //     console.error(error)
      //   }
      // }
      if (tempTask && (rawTasks.filter((obj) => obj.name === tempTask).length === 0)) {
        try {
          const response = await api.post(`api/projects/${id}/tasks/`, { name: tempTask, is_done: false, project: id });
          console.log(response.data)
          const obj: ProjectTask = response.data
          setRawTasks([...rawTasks, obj]);
          setTempTask("");
        } catch (error) {
          setError("Failed to add task")
          console.error(error)
        }
      }
    };

    const handleRemoveTask = async (task: ProjectTask) => {
      try {
        await api.delete(`api/projects/${id}/tasks/${task.id}`)
        setRawTasks(rawTasks.filter((obj) => obj.id !== task.id))
      } catch (error) {
        setError("Failed to delete task");
        console.error(error);
      }
    }

    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <i className="fas fa-edit text-orange-500"></i>
                Edit Project
              </h1>
              <button
                onClick={() => navigate("/")}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            {error && (
              <div className="mb-6 bg-red-500/10 text-red-500 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="subject"
                  className="text-white text-sm font-medium"
                >
                  Project Name
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-gray-800/50 text-white border border-gray-700/50 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:outline-none transition-colors duration-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-white text-sm font-medium"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-800/50 text-white border border-gray-700/50 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:outline-none transition-colors duration-200 min-h-[120px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="deadline"
                  className="text-white text-sm font-medium"
                >
                  Deadline
                </label>
                <input
                  type="date"
                  id="deadline"
                  value={deadLine}
                  onChange={(e) => setDeadLine(e.target.value)}
                  className="w-full bg-gray-800/50 text-white border border-gray-700/50 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:outline-none transition-colors duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-white text-sm font-medium">
                  Team Members
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempUser}
                    onChange={(e) => setTempUser(e.target.value)}
                    placeholder="Add team member..."
                    className="flex-1 bg-gray-800/50 text-white border border-gray-700/50 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:outline-none transition-colors duration-200"
                  />
                  <button
                    type="button"
                    onClick={handleAddUser}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {users.map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-800/50 text-white px-3 py-1.5 rounded-lg"
                    >
                      <i className="fas fa-user text-orange-500"></i>
                      {user}
                      <button
                        type="button"
                        onClick={() => handleRemoveUser(user)}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">
                    Add Task
                  </label>
                  <div className="flex gap-2">
                    {/*tasks*/}
                    <input
                      type="text"
                      value={tempTask}
                      onChange={(e) => setTempTask(e.target.value)}
                      placeholder="Add task..."
                      className="w-full bg-gray-800/50 text-white border border-gray-700/50 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:outline-none transition-colors duration-200"
                    />
                    <button
                      onClick={handleAddTask}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
                    >
                      <i className="fa fa-plus"></i>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {rawTasks.map((obj, index) => {
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-gray-800/50 text-white px-3 py-1.5 rounded-lg"
                        >
                          <i className="fas fa-tasks text-orange-500"></i>
                          {obj.name}
                          <button
                            type="button"
                            onClick={() => handleRemoveTask(obj)}
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors duration-200 flex items-center gap-2"
                >
                  <i className="fas fa-trash-alt"></i>
                  Delete Project
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="px-4 py-2 bg-gray-700/50 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 flex items-center gap-2"
                  >
                    <i className="fas fa-save"></i>
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  export default ProjectEdit;
