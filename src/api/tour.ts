import { supabase } from "../lib/supabase";

export async function getTourConfig(tourId) {
	const { data, error } = await supabase
		.from("tours")
		.select(
			`
      id,
      title,
      description,
      tour_steps (
        id,
        step_id,
        title,
        content,
        selector,
        order
      )
    `
		)
		.eq("id", tourId)
		.single();

	if (error) throw error;

	return {
		id: data.id,
		title: data.title,
		description: data.description,
		steps: data.tour_steps
			.sort((a, b) => a.order - b.order)
			.map((step) => ({
				id: step.step_id,
				selector: step.selector,
				title: step.title,
				content: step.content,
			})),
	};
}

export async function getLastCompletedStep(tourId, sessionId) {
	const { data, error } = await supabase
		.from("tour_events")
		.select("step_id, created_at")
		.eq("tour_id", tourId)
		.eq("session_id", sessionId)
		.eq("event_type", "step_completed")
		.order("created_at", { ascending: false })
		.limit(1);

	if (error || !data.length) return null;
	return data[0].step_id;
}

export async function logEvent(event) {
	const { error } = await supabase.from("tour_events").insert(event);
	if (error) console.error("Event log failed:", error);
}

export function logStepStarted(tourId, stepId, sessionId) {
	return logEvent({
		tour_id: tourId,
		step_id: stepId,
		event_type: "step_started",
		session_id: sessionId,
	});
}

export function logStepCompleted(tourId, stepId, sessionId) {
	return logEvent({
		tour_id: tourId,
		step_id: stepId,
		event_type: "step_completed",
		session_id: sessionId,
	});
}
export function logStepSkipped(tourId, stepId, sessionId) {
	return logEvent({
		tour_id: tourId,
		step_id: stepId,
		event_type: "step_skipped",
		session_id: sessionId,
	});
}
export function logTourStarted(tourId, sessionId) {
	return logEvent({
		tour_id: tourId,
		event_type: "tour_started",
		session_id: sessionId,
	});
}
export function logTourCompleted(tourId, sessionId) {
	return logEvent({
		tour_id: tourId,
		event_type: "tour_completed",
		session_id: sessionId,
	});
}
export function saveProgress(tourId, stepId, sessionId) {
	return logEvent({
		tour_id: tourId,
		step_id: stepId,
		event_type: "progress_saved",
		session_id: sessionId,
	});
}
