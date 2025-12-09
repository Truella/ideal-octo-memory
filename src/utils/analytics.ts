/**
 * Analytics event emitter
 * Tracks tour interactions for backend integration
 */

export type TourEvent =
	| "tour_started"
	| "tour_completed"
	| "tour_skipped"
	| "step_viewed"
	| "step_next"
	| "step_back"
	| "tour_error";

export interface TourEventData {
	tourId: string;
	stepId?: string;
	stepIndex?: number;
	timestamp: number;
	metadata?: Record<string, any>;
}

export class TourAnalytics {
	private tourId: string;
	private apiEndpoint?: string;

	constructor(tourId: string, apiEndpoint?: string) {
		this.tourId = tourId;
		this.apiEndpoint = apiEndpoint;
	}

	/**
	 * Track a tour event
	 */
	public track(event: TourEvent, data?: Partial<TourEventData>): void {
		const eventData: TourEventData = {
			tourId: this.tourId,
			timestamp: Date.now(),
			...data,
		};

		// Log to console in development
		console.log(`📊 [Analytics] ${event}:`, eventData);

		// Send to backend if endpoint is configured
		if (this.apiEndpoint) {
			this.sendToBackend(event, eventData);
		}

		// Dispatch custom event for external listeners
		this.dispatchCustomEvent(event, eventData);
	}

	/**
	 * Send analytics to backend
	 */
	private async sendToBackend(
		event: TourEvent,
		data: TourEventData
	): Promise<void> {
		try {
			await fetch(this.apiEndpoint!, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					event,
					data,
				}),
			});
		} catch (error) {
			console.warn("Failed to send analytics:", error);
		}
	}

	/**
	 * Dispatch browser event for external tracking
	 */
	private dispatchCustomEvent(event: TourEvent, data: TourEventData): void {
		const customEvent = new CustomEvent("tour-event", {
			detail: { event, data },
		});
		window.dispatchEvent(customEvent);
	}
}
