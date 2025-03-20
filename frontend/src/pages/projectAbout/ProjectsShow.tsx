import { useEffect, useState } from "react"
import api from "../../api/axios"
import { Link } from "react-router-dom"

const ProjectsShow = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getProjects = async () => {
      try {
        const response = await api.get("api/projects/")
        setProjects(response.data)
        setLoading(false)
      } catch (error) {
        console.error(error)
      }
    }
    getProjects()
  }, [])

  return loading ? <h1 className="text-white">loading...</h1> : <div id="full_display" className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-10">

    {
      projects.map((object: any) => {
        return <div className="group bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-700/50 mb-3 hover:border-orange-500/30 text-white hover:text-orange-500/90">
          <Link to={`/projects/${object.id}`} key={object.id} className="p-1.5 px-2 m-1 block w-[90%] rounded-sm">
            <h4 className="text-2xl group-hover:ml-1 transition-all duration-200">{object.name}</h4>
            <div className="text-gray-300 ml-2">
              <p className="justify-items-center">{object.description.length > 70 ? object.description.slice(0, 198) + "..." : object.description}</p>
            </div>
          </Link>
        </div>
        
      })
    }
  </div>
}

export default ProjectsShow