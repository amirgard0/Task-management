import React, { useState } from "react"
import CInput from "../../component/CInput"
import api from "../../api/axios"
import Cookies from "js-cookie"
import { useNavigate, Link } from "react-router-dom"

const Register = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    let errors = []
    if (password !== confirmPassword) {
      errors.push("Passwords do not match")
    }
    if (!(username && password && confirmPassword)) {
      errors.push("Fill all required fields")
    }
    if (errors.length !== 0) {
      setError(errors.join(", "))
      setIsLoading(false)
      return
    }

    const user = {
      username: username,
      password: password,
    }

    try {
      const { data } = await api.post("user/register", user)
      Cookies.set('access_token', data.access);
      Cookies.set('refresh_token', data.refresh);
      navigate("/")
    } catch (error: any) {
      console.error("Error during registration:", error)
      setError(error.response?.data?.detail || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#4a4c52] to-[#444855]">
      <div className="w-full max-w-md px-6">
        <div className="relative">
          {/* Decorative Elements */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#FF570C] opacity-10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#FF570C] opacity-10 rounded-full blur-xl"></div>
          
          {/* Main Card */}
          <div className="relative bg-[#5c5e64] rounded-lg shadow-2xl backdrop-blur-sm border border-[#FF570C]/10">
            {/* Top Pattern */}
            <div className="h-2 bg-gradient-to-r from-transparent via-[#FF570C] to-transparent opacity-35 rounded-b-lg"></div>

            <div className="px-8 pt-8 pb-6">
              <div className="text-center mb-8">
                <div className="inline-block p-3 rounded-full bg-[#FF570C]/10 mb-4">
                  <i className="fa fa-user-plus text-[#FF570C] text-3xl"></i>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                <p className="text-gray-400">Join Garder to start managing tasks</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-4">
                  <CInput 
                    var={username} 
                    setVar={setUsername} 
                    placeholder="Username" 
                    icon="fa fa-user"
                  />
                  <CInput 
                    var={email} 
                    setVar={setEmail} 
                    placeholder="Email (optional)" 
                    icon="fa fa-envelope"
                  />
                  <CInput 
                    var={password} 
                    setVar={setPassword} 
                    placeholder="Password" 
                    type="password"
                    icon="fa fa-lock"
                  />
                  <CInput 
                    var={confirmPassword} 
                    setVar={setConfirmPassword} 
                    placeholder="Confirm Password" 
                    type="password"
                    icon="fa fa-lock"
                    error={error || undefined}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-[#FF570C] text-white rounded-md hover:bg-orange-600 transition-all duration-300 font-medium text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <i className="fa fa-circle-o-notch fa-spin"></i>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa fa-user-plus"></i>
                      <span>Create Account</span>
                    </>
                  )}
                </button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-gray-400 hover:text-[#FF570C] transition-colors duration-200 text-sm flex items-center justify-center gap-1"
                  >
                    <span>Already have an account?</span>
                    <span className="font-medium">Sign in</span>
                    <i className="fa fa-arrow-right text-xs"></i>
                  </Link>
                </div>
              </form>
            </div>

            {/* Bottom Pattern */}
            <div className="h-2 bg-gradient-to-r from-transparent via-[#FF570C] to-transparent opacity-35 rounded-b-lg"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register