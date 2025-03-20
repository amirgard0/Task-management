import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export function Navigation() {
	const [isAuth, setIsAuth] = useState(false);
	const navigate = useNavigate()
	const url = window.location.pathname
	const [urlName, setUrlName] = useState("--No name--")

	const navigation = [
		{ name: "Projects", href: "/projects", icon: 'fa-folder' },
		{name: "Create Project", href: "/project_create", icon: "fa-plus"},
		{name: "Create Task", href: "/task_create", icon: "fa-plus"},
		// { name: "Tasks", href: "/tasks", icon: 'fa-tasks' },
		// { name: "Management", href: "/management", icon: 'fa-cog' },
		// { name: "Group", href: "/group", icon: 'fa-users' },
		{ name: 'Home', href: '/', icon: 'fa-home' },
	]

	useEffect(() => {
		const access_token = Cookies.get('access_token');
		setIsAuth(!!access_token);
	}, [isAuth]);

	useEffect(() => {
		const route = navigation.find(item => item.href === url) || 
			{ name: url === '/login' ? 'Login' : url === '/register' ? 'Register' : 'Not Found' };
		setUrlName(route.name);
	}, [url])

	const handleCC = (e: React.FormEvent) => {
		e.preventDefault()
		document.getElementById("headlessui-disclosure-button-:r0:")?.click()
		navigate("/login")
	}

	return (
		<Disclosure as="nav" className="bg-[#5c5e64] text-white shadow-lg">
			{({ open }) => (
				<>
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 md:px-3 ml-0">
						<div className="flex justify-between h-16">
							<div className="flex items-center">
								<div className="-mr-2 flex items-center md:hidden">
									<Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-[#4a4c52] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#FF570C]">
										<span className="sr-only">Open main menu</span>
										{open ? (
											<XMarkIcon className="block h-6 w-6" aria-hidden="true" />
										) : (
											<Bars3Icon className="block h-6 w-6" aria-hidden="true" />
										)}
									</Disclosure.Button>
								</div>
								<div className="flex-shrink-0 flex items-center">
									<h2 className="text-2xl font-bold text-white lg:ml-0 md:ml-0 sm:ml-4 ml-4">{urlName}</h2>
								</div>
							</div>
							<div className="hidden md:flex md:items-center md:space-x-4">
								{navigation.map((item) => (
									<Link
										key={item.name}
										to={item.href}
										className="px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:text-white hover:bg-[#4a4c52] transition-colors duration-200 flex items-center space-x-2"
									>
										<i className={`fa ${item.icon}`}></i>
										<span>{item.name}</span>
									</Link>
								))}
								{isAuth ? (
									<button
										onClick={() => navigate("/logout")}
										className="px-4 py-2 rounded-md text-sm font-medium bg-[#FF570C] text-white hover:bg-orange-600 transition-colors duration-200 flex items-center space-x-2"
									>
										<i className="fa fa-sign-out"></i>
										<span>Logout</span>
									</button>
								) : (
									<button
										onClick={() => navigate("/login")}
										className="px-4 py-2 rounded-md text-sm font-medium bg-[#FF570C] text-white hover:bg-orange-600 transition-colors duration-200 flex items-center space-x-2"
									>
										<i className="fa fa-sign-in"></i>
										<span>Login</span>
									</button>
								)}
							</div>
						</div>
					</div>

					<Disclosure.Panel className="md:hidden bg-[#4a4c52]">
						<div className="px-2 pt-2 pb-3 space-y-1">
							{navigation.map((item) => (
								<Link
									key={item.name}
									to={item.href}
									className="px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-[#3a3c42] transition-colors duration-200 inline-flex w-full items-center space-x-3"
								>
									<i className={`fa ${item.icon}`}></i>
									<span>{item.name}</span>
								</Link>
							))}
							{isAuth ? (
								<button
									onClick={() => navigate("/logout")}
									className="w-full px-3 py-2 rounded-md text-base font-medium text-white bg-[#FF570C] hover:bg-orange-600 transition-colors duration-200 inline-flex items-center space-x-3"
								>
									<i className="fa fa-sign-out"></i>
									<span>Logout</span>
								</button>
							) : (
								<button
									onClick={() => navigate("/login")}
									className="w-full px-3 py-2 rounded-md text-base font-medium text-white bg-[#FF570C] hover:bg-orange-600 transition-colors duration-200 inline-flex items-center space-x-3"
								>
									<i className="fa fa-sign-in"></i>
									<span>Login</span>
								</button>
							)}
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
}
