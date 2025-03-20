import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import CInput from "../../component/CInput";
import api from "../../api/axios";

const TaskCreate = () => {
  const [taskName, setTaskName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
		if (taskName == "") {
			setError("Please fill the Form")
			return
		}
    try {
      await api.post("api/tasks/", { name: taskName, is_done: false });
      navigate("/");
    } catch (error) {
      setError("Fail to submit Task");
      console.log(error);
    }
  };

  return (
		<div className="bg-gray-800 min-h-screen">
			<div className="container flex items-center pt-16 justify-center mx-auto px-4 ">
				<div className="bg-gradient-to-br from-gray-700/30 to-gray-600/50 backdrop-blur-sm rounded-xl p-6 shadow-lg w-full max-w-md flex flex-col items-center">
					
					<button
					 onClick={e=>{navigate(-1)}}
					 className="inline p-1 w-8 h-8 ml-3 self-end rounded-md text-orange-600 hover:text-white cursor-pointer transition-all duration-200">
						<i className="fa fa-arrow-left text-xl"></i>
					</button>
					<h2 className="text-2xl font-bold text-white mb-4 m-auto inline">
						Create Task
					</h2>
					<form onSubmit={handleSubmit} className="space-y-4 w-[100%]">
						{error && (
							<div className="mb-6 bg-red-500/10 text-red-500 px-4 py-3 rounded-lg">
								{error}
							</div>
						)}
						<CInput
							var={taskName}
							setVar={setTaskName}
							placeholder="Task Name"
							icon="fa fa-tasks"
						/>
						<div className="flex items-center mt-4">
							<button
								type="submit"
								className="bg-transparent font-semibold border-2 text-lg border-orange-600 w-[95%] self-center m-auto text-orange-600 py-2 px-4 rounded-md hover:bg-orange-600 hover:text-white transition-all duration-300"
							>
								<i className="fa fa-paper-plane mr-2"></i>
								Submit
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
  );
};

export default TaskCreate;
