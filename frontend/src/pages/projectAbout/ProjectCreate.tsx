import { useNavigate } from "react-router-dom"
import api from "../../api/axios"
import CInput from "../../component/CInput"
import CTextArea from "../../component/CTexAria"
import { useRef, useState } from "react"

const ProjectCreate = () => {
	const [subject, setSubject] = useState("")
	const [description, setDescription] = useState("")
	const [tempUser, setTempUser] = useState("")
	const [users, setUsers]: [Array<string>, Function] = useState([])
	const [deadLine, setDeadLine] = useState("")
	const navigate = useNavigate()
	const [error, setError] = useState("")

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			// make the deadLine format to YYYY-MM-DD
			const date = new Date(deadLine)
			const year = date.getFullYear()
			const month = String(date.getMonth() + 1).padStart(2, '0')
			const day = String(date.getDate()).padStart(2, '0')
			const formattedDate = `${year}-${month}-${day}`
			
			await api.post("api/projects/", {
				name: subject,
				description: description,
				users: users,
				dead_line: formattedDate,
			})
			navigate(-1)
		} catch (error) {
			setError("Failed to create project")
			console.error(error)
		}
	}

	const handleAddUser = (e: React.FormEvent) => {
		e.preventDefault()
		users.push(tempUser)
		setUsers(users)
		setTempUser("")
	}

	const handleDeleteUser = (username: string) => {
		setUsers(users.filter(a => a !== username))
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8">
		<div className="container mx-auto px-4">
		  <div className="max-w-2xl mx-auto">
			<div className="flex items-center justify-between mb-8">
			  <h1 className="text-3xl font-bold text-white flex items-center gap-3">
				<i className="fas fa-edit text-orange-500"></i>
				Create Project
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
				<label htmlFor="subject" className="text-white text-sm font-medium">
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
				<label htmlFor="description" className="text-white text-sm font-medium">
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
				<label htmlFor="deadline" className="text-white text-sm font-medium">
				  Deadline
				</label>
				<input
				  type="datetime-local"
				  id="deadline"
				  value={deadLine}
				  onChange={(e) => setDeadLine(e.target.value)}
				  className="w-full bg-gray-800/50 text-white border border-gray-700/50 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:outline-none transition-colors duration-200"
				/>
			  </div>
  
			  <div className="space-y-2">
				<label className="text-white text-sm font-medium">Team Members</label>
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
						onClick={() => handleDeleteUser(user)}
						className="text-gray-400 hover:text-red-500 transition-colors duration-200"
					  >
						<i className="fas fa-times"></i>
					  </button>
					</div>
				  ))}
				</div>
			  </div>
  
			  <div className="flex items-center justify-between pt-4">
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
	)
}

export default ProjectCreate