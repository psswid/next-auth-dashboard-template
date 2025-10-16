import React from 'react';
import { requireUser } from '@/lib/server-auth';

export default async function DashboardPage() {
	const user = await requireUser();

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold">Dashboard</h1>
			<p className="mt-4">Welcome back{user?.name ? `, ${user.name}` : ''}!</p>

			<section className="mt-6">
				<h2 className="font-semibold">Account</h2>
				<ul>
					<li><strong>Email:</strong> {user?.email}</li>
					<li><strong>Role:</strong> {user?.role}</li>
					<li><strong>Active:</strong> {user?.isActive ? 'Yes' : 'No'}</li>
				</ul>
			</section>
		</div>
	);
}
