import { User, Role } from '@prisma/client';

/** Simple role checks and policy helpers
 * Laravel analogies: Gate::allows / Policy classes
 */
export function isAdmin(user: Pick<User, 'role'> | null | undefined) {
	return !!user && user.role === 'admin';
}

export function isManager(user: Pick<User, 'role'> | null | undefined) {
	return !!user && (user.role === 'manager' || user.role === 'admin');
}

export function canManageUsers(user: Pick<User, 'role'> | null | undefined) {
	return isManager(user);
}

export function canEditUser(currentUser: User | null | undefined, targetUserId: string) {
	if (!currentUser) return false;
	if (currentUser.role === 'admin') return true;
	// allow editing own profile
	return currentUser.id === targetUserId;
}

export default {
	isAdmin,
	isManager,
	canManageUsers,
	canEditUser,
};

