/* eslint-disable tailwindcss/classnames-order */
"use client"

import { useTheme } from "next-themes";
import { Button as ButtonAria, Menu, MenuItem, MenuItemProps, MenuTrigger, Popover } from 'react-aria-components';
import { LuMoon, LuSun } from "react-icons/lu";
import { useEffect, useState } from 'react';

function ActionItem(props: MenuItemProps) {
	const { theme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	
	useEffect(() => {
		setMounted(true);
	}, []);
	
	const currentTheme = mounted ? resolvedTheme || theme : 'light';

	return (
		<MenuItem
			{...props}
			className={`flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none transition-colors duration-200 ${
				currentTheme === 'light'
					? 'text-gray-700 hover:bg-gray-100 focus:bg-gray-100'
					: 'text-gray-300 hover:bg-gray-700 focus:bg-gray-700'
			}`}
		/>
	);
}

export function ThemeToggle() {
	const { setTheme, theme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	
	useEffect(() => {
		setMounted(true);
	}, []);
	
	const currentTheme = mounted ? resolvedTheme || theme : 'light';

	return (
		<MenuTrigger>
			<ButtonAria
				aria-label="ThemeMenu"
				className={`relative group inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 ${
					currentTheme === 'light'
						? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
						: 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600'
				}`}
			>
				<div className="relative">
					<LuSun className={`size-[1.2rem] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 ${
						currentTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
					}`} />
					<LuMoon className={`absolute top-0 size-[1.2rem] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 ${
						currentTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
					}`} />
				</div>
				<span className="sr-only">Toggle theme</span>
			</ButtonAria>
			<Popover placement='bottom right' className={`origin-top-left overflow-auto rounded-lg border p-1 shadow-lg ring-1 ring-black/5 fill-mode-forwards entering:animate-in entering:fade-in entering:zoom-in-95 exiting:animate-out exiting:fade-out exiting:zoom-out-95 ${
				currentTheme === 'light'
					? 'bg-white border-gray-200'
					: 'bg-gray-800 border-gray-700'
			}`}>
				<Menu className="outline-none">
					<ActionItem id="light" onAction={() => setTheme("light")}>
						<LuSun className={`mr-2 size-4 ${
							currentTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
						}`} />
						Light
					</ActionItem>
					<ActionItem id="dark" onAction={() => setTheme("dark")}>
						<LuMoon className={`mr-2 size-4 ${
							currentTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
						}`} />
						Dark
					</ActionItem>
				</Menu>
			</Popover>
		</MenuTrigger>
	)
}