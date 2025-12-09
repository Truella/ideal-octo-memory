import { TourEngine } from "./tour-engine/index";
import type { Tour } from "./types";
import "./styles/tooltip.css";

/**
 * Embeddable tour loader
 * Reads data-tour-id from script tag and fetches tour configuration
 */
class TourLoader {
	private apiBaseUrl: string;

	constructor() {
		// TODO: Replace with your actual API endpoint
		this.apiBaseUrl = "https://api.yourdomain.com/tours";
	}

	/**
	 * Initialize tour from script tag
	 */
	public async init(): Promise<void> {
		const scriptTag = this.findScriptTag();

		if (!scriptTag) {
			console.warn("Tour script tag not found");
			return;
		}

		const tourId = scriptTag.getAttribute("data-tour-id");
		const autoStart = scriptTag.getAttribute("data-auto-start") !== "false";
		const apiUrl = scriptTag.getAttribute("data-api-url");

		if (!tourId) {
			console.error("data-tour-id attribute is required");
			return;
		}

		// Override API URL if provided
		if (apiUrl) {
			this.apiBaseUrl = apiUrl;
		}

		try {
			const tour = await this.fetchTour(tourId);
			const engine = new TourEngine(tour);

			if (autoStart) {
				// Auto-start after page loads
				if (document.readyState === "loading") {
					document.addEventListener("DOMContentLoaded", () => {
						setTimeout(() => engine.start(), 500);
					});
				} else {
					setTimeout(() => engine.start(), 500);
				}
			}

			// Expose global API for manual control
			(window as any).TourWidget = {
				start: () => engine.start(),
				// Add more methods as needed
			};
		} catch (error) {
			console.error("Failed to load tour:", error);
		}
	}

	/**
	 * Find the tour script tag
	 */
	private findScriptTag(): HTMLScriptElement | null {
		const scripts = document.querySelectorAll("script[data-tour-id]");
		return scripts[scripts.length - 1] as HTMLScriptElement;
	}

	/**
	 * Fetch tour configuration from backend
	 */
	private async fetchTour(tourId: string): Promise<Tour> {
		const response = await fetch(`${this.apiBaseUrl}/${tourId}`);

		if (!response.ok) {
			throw new Error(`Failed to fetch tour: ${response.status}`);
		}

		return await response.json();
	}
}

// Auto-initialize when script loads
const loader = new TourLoader();
loader.init();
