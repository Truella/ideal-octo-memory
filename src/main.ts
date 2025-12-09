import { TourEngine } from "./tour-engine/index";
import mockTour from "./mock/mockTour.json";
import "./styles/tooltip.css";

// For development: auto-start with mock data
function initTour() {
	console.log("🎯 Tour Widget Loaded");

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", startMockTour);
	} else {
		startMockTour();
	}
}

function startMockTour() {
	console.log("🔥 Initializing tour with mock data...");
	const tourEngine = new TourEngine(mockTour);

	// Auto-start after a short delay to let page render
	setTimeout(() => {
		tourEngine.start();
	}, 500);
}

// Initialize immediately
initTour();
