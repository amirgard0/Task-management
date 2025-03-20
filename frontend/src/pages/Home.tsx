import Cookies from "js-cookie";
import React, { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { removeArray, mergeArray } from "../utils/ArrayUtils";
// import CCheckBox from "../component/CCheckBox";

interface Task {
  id: number;
  name: string;
  is_done: boolean;
  project_id: number;
}

interface Project {
  id: number;
  name: string;
  description: string;
  dead_line: string;
  users_detail: Array<{
    username: string;
    id: number;
  }>;
  creator_id: number;
}

interface User {
  email: string;
  username: string;
  id: number;
}

//#region Authenticated
const AuthenticatedPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectTasks, setProjectTasks] = useState<{ [key: number]: Task[] }>(
    {}
  );
  const [user, setUser] = useState<User | null>(null);
  const inputChange = useRef<HTMLInputElement[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getProjects = async () => {
      try {
        const { data } = await api.get("api/projects/");
        setProjects(data);

        const tasksData = await Promise.all(
          data.map(async (project: Project) => {
            const { data } = await api.get(`api/projects/${project.id}/tasks/`);
            return { projectId: project.id, tasks: data };
          })
        );

        const response = await api.get("api/getUser/");
        setUser(response.data);
        console.log(response.data);

        const updatedTasks = tasksData.reduce(
          (acc, { projectId, tasks }) => {
            acc[projectId] = tasks;
            return acc;
          },
          {} as Record<string, any>
        );

        setProjectTasks(updatedTasks);
      } catch (error) {
        console.error(error);
      }
    };

    const getTasks = async () => {
      try {
        const { data } = await api.get("api/tasks/");
        setTasks(data);
      } catch (error) {
        console.error("error in tasks fetch: ", error);
      }
    };
    getProjects();
    getTasks();
  }, []);

  const handleTasksDoneChange = async (
    id: any,
    value: boolean,
    name: string
  ) => {
    await api.put(`/api/tasks/${id}/`, { id: id, is_done: value, name: name });
  };

  const handleDeleteTask = async (id: any) => {
    await api.delete(`/api/tasks/${id}/`);
    setTasks(tasks.filter((task: any) => task.id !== id));
  };

  const handleEditClick = (target: HTMLButtonElement, task: Task) => {
    const input: HTMLInputElement = inputChange.current[task.id];
    input.disabled = !input.disabled;
    input.focus();

    const targetClasses = target.classList;

    const onEditTargetClass = [
      "fa-edit",
      "border-orange-600",
      "text-orange-600",
      "hover:text-white",
      "hover:bg-orange-600",
    ];
    const onSaveTargetClass = [
      "fa-save",
      "border-green-600",
      "text-green-600",
      "hover:text-white",
      "hover:bg-green-600",
    ];
    const onEditInputClass = [
      "border-transparent",
      "px-0",
      "border-orange-600",
    ];
    const onSaveInputClass = ["border-white", "px-3", "border-green-600"];

    if (targetClasses.contains("fa-edit")) {
      targetClasses.remove(...onEditTargetClass);
      targetClasses.add(...onSaveTargetClass);

      input.classList.remove(...onEditInputClass);
      input.classList.add(...onSaveInputClass);
    } else {
      targetClasses.remove(...onSaveTargetClass);
      targetClasses.add(...onEditTargetClass);

      input.classList.remove(...onSaveInputClass);
      input.classList.add(...onEditInputClass);

      //save
      handleTasksDoneChange(task.id, task.is_done, input.value);
    }
  };

  return (
    <div
      id="full_display"
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8"
    >
      {/* #region Tasks */}
      <>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-start mb-8 gap-5">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <i className="fas fa-tasks text-orange-500"></i>
              Tasks
            </h1>
            <button
              onClick={(e) => navigate("/task_create")}
              className="bg-gray-800/50 group text-orange-500 w-9 h-9 group-hover:rotate-180 flex items-center justify-center backdrop-blur-sm rounded-xl p-1 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-700/50"
            >
              <i className="fas fa-plus group-hover:rotate-90 transition-all duration-300"></i>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tasks.map((object: any) => (
              <div
                key={object.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-700/50"
              >
                <div className="flex items-center justify-between space-x-3">
                  <div className="flex-1 min-w-0 items-center">
                    <div className="flex items-center gap-3">
                      <label className="relative flex items-center cursor-pointer p-1 rounded-full hover:bg-gray-700/30 transition-colors duration-200">
                        <input
                          type="checkbox"
                          className="appearance-none w-5 h-5 border-2 border-gray-500 rounded-md checked:border-orange-500 checked:bg-orange-500 transition-all duration-200 peer"
                          defaultChecked={object.is_done}
                          onChange={(e) => {
                            handleTasksDoneChange(
                              object.id,
                              e.target.checked,
                              object.name
                            );
                            object.is_done = e.target.checked;
                          }}
                        />
                        <i className="fas fa-check text-xs text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200"></i>
                      </label>
                      <input
                        ref={(el: HTMLInputElement | null) => {
                          if (el) inputChange.current[object.id] = el;
                        }}
                        type="text"
                        defaultValue={object.name}
                        disabled
                        className="bg-transparent text-white w-full outline-none border rounded-lg py-1.5 border-transparent focus:border-orange-500 transition-all duration-200 disabled:opacity-90"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleEditClick(e.currentTarget, object)}
                      className="fas fa-edit p-2 rounded-lg border text-sm border-orange-600/50 text-orange-500 hover:text-white hover:bg-orange-600 hover:border-orange-600 transition-all duration-200"
                    ></button>
                    <button
                      onClick={() => handleDeleteTask(object.id)}
                      className="fas fa-trash-alt p-2 rounded-lg border text-sm border-red-600/50 text-red-500 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-200"
                    ></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
      {/* #endregion Tasks */}

      {/* #region Projects */}
      <>
        <div className="container mx-auto px-4 pt-12">
          <div className="flex items-center justify mb-8 gap-3">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <i className="fas fa-project-diagram text-orange-500"></i>
              Projects
            </h1>
            <button
              onClick={(e) => navigate("/project_create")}
              className="bg-gray-800/50 text-orange-500 w-9 h-9 group flex items-center justify-center backdrop-blur-sm rounded-xl p-1 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-700/50"
            >
              <i className="fas fa-plus group-hover:rotate-90 transition-all duration-300"></i>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {projects.map((object: Project, index) => (
              <Link
                to={`/projects/${object.id}`}
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-700/50 hover:border-orange-500/50 relative"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <i className="fas fa-folder text-2xl text-orange-500 group-hover:text-orange-400 transition-colors duration-200"></i>
                      {(() => {
                        const totalTasks = projectTasks[object.id]?.length || 0;
                        const completedTasks =
                          projectTasks[object.id]?.filter(
                            (obj) => obj.is_done == true
                          ).length || 0;
                        const deadline = object.dead_line
                          ? new Date(object.dead_line)
                          : null;
                        const isOverdue = deadline && deadline < new Date();
                        const isComplete =
                          totalTasks > 0 && completedTasks === totalTasks;

                        if (isComplete) {
                          return (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full">
                              <span className="sr-only">Complete</span>
                            </div>
                          );
                        } else if (isOverdue) {
                          return (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse">
                              <span className="sr-only">Overdue</span>
                            </div>
                          );
                        } else if (
                          deadline &&
                          deadline > new Date() &&
                          deadline <
                            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        ) {
                          return (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full">
                              <span className="sr-only">Due soon</span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                    <h2 className="text-2xl font-bold text-white group-hover:text-orange-500 transition-colors duration-200">
                      {object.name}
                    </h2>
                  </div>
                  {object.creator_id == user?.id && (
                    <button
                      onClick={(e) => {
                        e.preventDefault(); // Prevents navigating to project page
                        e.stopPropagation(); // Stops event bubbling to the outer Link
                        navigate(`/projects/${object.id}/edit`);
                      }}
                      className="p-2 rounded-lg border text-sm border-orange-600/50 text-orange-500 hover:text-white hover:bg-orange-600 hover:border-orange-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
                      title="Edit project"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  )}
                </div>
                <p className="text-gray-300 text-lg mb-4">
                  {object.description.length > 70
                    ? object.description.slice(0, 60) + "..."
                    : object.description}
                </p>
                <div className="space-y-4 h-max relative bottom-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-gray-400">
                        {projectTasks[object.id]?.filter(
                          (obj) => obj.is_done == true
                        ).length || 0}
                        /{projectTasks[object.id]?.length || 0} tasks
                      </span>
                    </div>
                    <div className="flex-1 h-2 bg-gray-700/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          projectTasks[object.id]?.filter(
                            (obj) => obj.is_done == true
                          ).length === projectTasks[object.id]?.length &&
                          projectTasks[object.id]?.length > 0
                            ? "bg-green-500"
                            : "bg-orange-500"
                        }`}
                        style={{
                          width: `${
                            projectTasks[object.id]?.length > 0
                              ? (projectTasks[object.id]?.filter(
                                  (task) => task.is_done
                                ).length /
                                  projectTasks[object.id]?.length) *
                                100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-users"></i>
                        <span>{object.users_detail?.length || 0} members</span>
                      </div>
                      {object.dead_line && (
                        <div className="flex items-center gap-2">
                          <i className="fas fa-clock"></i>
                          <span>
                            {new Date(object.dead_line).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex -space-x-2">
                      {object.users_detail
                        ?.slice(0, 3)
                        .map((user: any, userIndex: number) => (
                          <div
                            key={userIndex}
                            className="w-8 h-8 rounded-full bg-orange-500/10 border-2 border-orange-500/20 flex items-center justify-center text-orange-500"
                            title={user.username}
                          >
                            <i className="fas fa-user text-xs"></i>
                          </div>
                        ))}
                      {object.users_detail?.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-orange-500/10 border-2 border-orange-500/20 flex items-center justify-center text-orange-500">
                          <span className="text-xs">
                            +{object.users_detail.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </>
      {/* #endregion Projects */}
    </div>
  );
};
//#endregion Authenticated

//#region Not Auth
const NotAuthenticatedPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#4a4c52] to-[#444855] px-4">
      <div className="w-full max-w-6xl">
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Minimalist Hero */}
          <div className="relative z-10">
            <div className="space-y-8">
              {/* Brand Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-[#FF570C]/10 rounded-full text-[#FF570C] text-sm font-medium">
                <span className="mr-2">✨</span>
                <span>Task Management Reimagined</span>
              </div>

              {/* Hero Text */}
              <div className="space-y-6">
                <h1 className="text-6xl font-bold text-white leading-tight">
                  Organize
                  <br />
                  <span className="text-[#FF570C]">Everything</span>
                  <br />
                  in One Place
                </h1>
                <p className="text-gray-400 text-xl max-w-md leading-relaxed">
                  Streamline your workflow, collaborate seamlessly, and achieve
                  more with Garder's intuitive task management.
                </p>
              </div>

              {/* CTA Section */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/login"
                  className="group relative overflow-hidden px-8 py-4 bg-[#FF570C] text-white rounded-xl font-medium text-lg hover:shadow-2xl hover:shadow-[#FF570C]/20 transition-all duration-300"
                >
                  <div className="relative z-10 flex items-center justify-center">
                    <span>Get Started</span>
                    <i className="fa fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF570C] to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  to="/register"
                  className="group px-8 py-4 border-2 border-[#FF570C]/30 text-[#FF570C] rounded-xl font-medium text-lg hover:border-[#FF570C] transition-colors duration-300 flex items-center justify-center"
                >
                  <i className="fa fa-user-plus mr-2 transform group-hover:scale-110 transition-transform"></i>
                  <span>Create Account</span>
                </Link>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
                <div>
                  <div className="text-2xl font-bold text-white">10k+</div>
                  <div className="text-gray-400">Active Users</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">50k+</div>
                  <div className="text-gray-400">Tasks Done</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">99%</div>
                  <div className="text-gray-400">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Creative Visual */}
          <div className="relative lg:h-[600px] flex items-center justify-center">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#FF570C] opacity-20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-[#FF570C] opacity-10 rounded-full blur-3xl animate-pulse delay-300"></div>
            </div>

            {/* Feature Cards Grid */}
            <div className="relative grid grid-cols-2 gap-6 p-8 w-full max-w-lg">
              {/* Feature Cards with Hover Effects */}
              <div className="group bg-[#4a4c52]/50 backdrop-blur-sm p-6 rounded-2xl hover:bg-[#4a4c52]/70 transition-all duration-300 border border-white/5 hover:border-[#FF570C]/20">
                <div className="inline-flex p-3 rounded-xl bg-[#FF570C]/10 mb-4 group-hover:bg-[#FF570C]/20 transition-colors duration-300">
                  <i className="fa fa-tasks text-[#FF570C] text-2xl"></i>
                </div>
                <h3 className="text-white font-medium mb-2">Smart Tasks</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Organize and prioritize your work efficiently
                </p>
              </div>

              <div className="group bg-[#4a4c52]/50 backdrop-blur-sm p-6 rounded-2xl hover:bg-[#4a4c52]/70 transition-all duration-300 border border-white/5 hover:border-[#FF570C]/20 translate-y-8">
                <div className="inline-flex p-3 rounded-xl bg-[#FF570C]/10 mb-4 group-hover:bg-[#FF570C]/20 transition-colors duration-300">
                  <i className="fa fa-folder text-[#FF570C] text-2xl"></i>
                </div>
                <h3 className="text-white font-medium mb-2">Projects</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Group and manage related tasks together
                </p>
              </div>

              <div className="group bg-[#4a4c52]/50 backdrop-blur-sm p-6 rounded-2xl hover:bg-[#4a4c52]/70 transition-all duration-300 border border-white/5 hover:border-[#FF570C]/20">
                <div className="inline-flex p-3 rounded-xl bg-[#FF570C]/10 mb-4 group-hover:bg-[#FF570C]/20 transition-colors duration-300">
                  <i className="fa fa-users text-[#FF570C] text-2xl"></i>
                </div>
                <h3 className="text-white font-medium mb-2">Teams</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Collaborate with your team seamlessly
                </p>
              </div>

              <div className="group bg-[#4a4c52]/50 backdrop-blur-sm p-6 rounded-2xl hover:bg-[#4a4c52]/70 transition-all duration-300 border border-white/5 hover:border-[#FF570C]/20 translate-y-8">
                <div className="inline-flex p-3 rounded-xl bg-[#FF570C]/10 mb-4 group-hover:bg-[#FF570C]/20 transition-colors duration-300">
                  <i className="fa fa-chart-line text-[#FF570C] text-2xl"></i>
                </div>
                <h3 className="text-white font-medium mb-2">Analytics</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Track progress and measure success
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
//#endregion Not Auth

//#region Home
const Home = () => {
  const accessToken = Cookies.get("access_token");

  if (accessToken) {
    return <AuthenticatedPage />;
  } else {
    return <NotAuthenticatedPage />;
  }
};
//#endregion Home

export default Home;
