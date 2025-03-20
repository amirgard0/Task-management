import { useEffect, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

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
}
const ProjectShow = () => {
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project>();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const inputChange = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    const getProject = async () => {
      try {
        const response = await api.get(`api/projects/${id}/`);
        setName(response.data.name);
        setDescription(response.data.description);
        setDeadline(response.data.dead_line);
        setProject(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    const getProjectTasks = async () => {
      try {
        const response = await api.get(`api/projects/${id}/tasks/`);
        setProjectTasks(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getProject();
    getProjectTasks();
  }, []);

  const handleTasksDoneChange = async (
    taskId: any,
    value: boolean,
    name: string
  ) => {
    await api.put(`/api/projects/${id}/tasks/${taskId}/`, { id: taskId, is_done: value, name: name, project: id });
    const updatedTasks = projectTasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, is_done: value };
      }
      return task;
    });
    setProjectTasks(updatedTasks);
  };

  return loading ? (
    <div>
      <h1>Loading...</h1>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8">
      <div className="items-center lg:p-15 md:p-10 p-5 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 min-h-screen">
        {/* name */}
        <div className="flex text-3xl group justify-center">
          <i className="fa fa-folder text-orange-600 text-3xl mr-3 inline"></i>
          <h1 className="font-bold text-gray-100 inline">{name}</h1>
        </div>
        {/* description */}
        <div className="block mt-3 mb-5 lg:w-[50%] md:w-[60%] sm:w-[70%] w-[100%] m-auto bg-gradient-to-br from-gray-700/40 to-gray-600/30 drop-shadow-2xl transition-all duration-200 px-6 py-2 rounded-xl border border-gray-600/60">
          <p className="text-gray-100 ml-2 text-xl">
            {description}
          </p>
        </div>
        <div className="lg:w-[50%] md:w-[60%] sm:w-[70%] w-[100%] m-auto bg-gradient-to-br from-gray-800/50 to-gray-700/30 drop-shadow-2xl transition-all duration-200 px-6 py-2 pb-5 rounded-xl border border-gray-600/50">
          {/* tasks */}
          <div className="mt-3 w-[100%] mb-[5%]">
            <h2 className="font-semibold text-gray-300 mb-2 text-2xl flex justify-center items-center">
              <i className="fa fa-tasks mr-2 text-orange-600 text-3xl"></i>
              Tasks
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {projectTasks.map((object: Task) => (
                <div
                  key={object.id}
                  className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-700/50"
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
                          className="bg-transparent text-white w-full group-hover:text-orange-700 outline-none border rounded-lg py-1.5 border-transparent focus:border-orange-500 transition-all duration-150 disabled:opacity-90"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="group block w-[100%] mb-[5%] bg-gray-800/80 p-2 rounded-lg border-gray-600/50 border drop-shadow-2xl">
            <div className="flex justify-center">
              <div className="space-y-4 h-max ml-2 relative bottom-0 w-[100%] inline-block">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 group-hover:text-orange-500 transition-all duration-150">
                      {projectTasks?.filter((obj) => obj.is_done == true)
                        .length || 0}
                      /{projectTasks?.length || 0} <span className="text-gray-400 transition-all duration-200">tasks</span>
                    </span>
                  </div>
                  <div className="flex-1 h-2 bg-gray-700/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        projectTasks?.filter((obj) => obj.is_done == true)
                          .length === projectTasks?.length &&
                        projectTasks?.length > 0
                          ? "bg-green-500"
                          : "bg-orange-500"
                      }`}
                      style={{
                        width: `${
                          projectTasks?.length > 0
                            ? (projectTasks?.filter((task) => task.is_done)
                                .length /
                                projectTasks?.length) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="lg:flex md:flex block items-center gap-4 w-[100%]">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-users group-hover:text-orange-500 transition-all duration-150"></i>
                      <span>{project?.users_detail?.length || 0} members</span>
                    </div>
                    {project?.dead_line && (
                      <div className="flex items-center self-end ml-auto gap-2">
                        <i className="fas fa-clock group-hover:text-orange-500 transition-all duration-150"></i>
                        <span>
                          {new Date(project?.dead_line).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex -space-x-2">
                    {project?.users_detail
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
                    {(project?.users_detail?.length || 0) > 3 && (
                      <div className="w-8 h-8 rounded-full bg-orange-500/10 border-2 border-orange-500/20 flex items-center justify-center text-orange-500">
                        <span className="text-xs">
                          +{(project?.users_detail.length || 0) - 3}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* edit */}
          <div className="mt-3 text-orange-500 flex justify-center items-center m-auto w-[100%]">
            <div className="w-[100%] flex gap-3">
              <Link
                to={`/projects/${id}/edit`}
                className="border-orange-600 w-[80%] inline-flex items-center justify-center hover:bg-orange-600 font-semibold hover:text-white border-2 px-2 py-1 rounded-lg transition-colors duration-200"
              >
                <i className="fa fa-edit mr-2"></i>
                Edit
              </Link>
              <button className="border-orange-600 w-[20%] inline-flex items-center justify-center hover:bg-orange-600 font-semibold hover:text-white border-2 px-2 py-1 rounded-lg transition-colors duration-200" onClick={(e)=>{navigate(-1)}}>
                <i className="fa fa-arrow-left mr-2"></i>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectShow;
