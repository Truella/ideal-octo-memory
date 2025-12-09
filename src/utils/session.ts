export function generateSessionId() {
	return "sess_" + Math.random().toString(36).substring(2, 12);
}
