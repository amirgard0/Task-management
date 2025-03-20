import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import CInput from "../../component/CInput"
import axios from 'axios';

const Login = () => {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const [isLoading, setIsLoading] = useState(false)

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("")
		setIsLoading(true)

		const user = {
			username: username,
			password: password
		}

		try {
			const { data } = await axios.post(`${process.env.VITE_BASE_URL}token/`, user)
			Cookies.set('access_token', data.access);
			Cookies.set('refresh_token', data.refresh);
			window.location.href = "/"
		}
		catch (error: any) {
			console.error("error in token fetch: ", error)
			if (error.response?.data?.detail === 'No active account found with the given credentials') {
				setError("Invalid username or password")
			} else {
				setError("An error occurred. Please try again.")
			}
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
									<i className="fa fa-sign-in text-[#FF570C] text-3xl"></i>
								</div>
								<h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
								<p className="text-gray-400">Sign in to continue to Garder</p>
							</div>

							<form onSubmit={submit} className="space-y-6">
								<div className="space-y-4">
									<CInput
										var={username}
										setVar={setUsername}
										placeholder="Username"
										icon="fa fa-user"
									/>
									<CInput
										var={password}
										setVar={setPassword}
										placeholder="Password"
										type="password"
										icon="fa fa-lock"
									/>
								</div>

								{error && (
									<div className="text-red-400 text-sm flex items-center gap-2">
										<i className="fa fa-exclamation-circle"></i>
										<span>{error}</span>
									</div>
								)}

								<button
									type="submit"
									disabled={isLoading}
									className="w-full py-3 px-4 bg-[#FF570C] text-white rounded-md hover:bg-orange-600 transition-all duration-300 font-medium text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isLoading ? (
										<>
											<i className="fa fa-circle-o-notch fa-spin"></i>
											<span>Signing in...</span>
										</>
									) : (
										<>
											<i className="fa fa-sign-in"></i>
											<span>Sign In</span>
										</>
									)}
								</button>

								<div className="text-center">
									<Link
										to="/register"
										className="text-gray-400 hover:text-[#FF570C] transition-colors duration-200 text-sm flex items-center justify-center gap-1"
									>
										<span>Don't have an account?</span>
										<span className="font-medium">Create one</span>
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
};

export default Login;