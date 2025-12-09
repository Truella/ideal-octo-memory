import type { Tour, TourStep } from "../types";
import { Tooltip } from "../components/tooltip";
import { Overlay } from "../components/overlay";
import { Highlight } from "../components/highlight";
import { CompletionScreen } from "../components/completion";
import { PositionCalculator } from "../utils/position";
import { TourStorage } from "../utils/storage";
import { KeyboardHandler } from "../utils/keyboard";
import { TourAnalytics } from "../utils/analytics";

export class TourEngine {
	private tour: Tour;
	private currentStepIndex: number = 0;
	private tooltip: Tooltip;
	private overlay: Overlay;
	private highlight: Highlight;
	private positionCalculator: PositionCalculator;
	private storage: TourStorage;
	private keyboard: KeyboardHandler;
	private analytics: TourAnalytics;

	constructor(tour: Tour, analyticsEndpoint?: string) {
		this.tour = tour;
		this.storage = new TourStorage(tour.id);
		this.analytics = new TourAnalytics(tour.id, analyticsEndpoint);
		this.overlay = new Overlay();
		this.highlight = new Highlight();
		this.positionCalculator = new PositionCalculator();
		this.keyboard = new KeyboardHandler(
			() => this.next(),
			() => this.back(),
			() => this.skip()
		);
		this.tooltip = new Tooltip(
			() => this.next(),
			() => this.back(),
			() => this.skip(),
			() => this.dismiss() // NEW: Permanent dismiss
		);
	}

	public start(): void {
		// Check if tour was already completed
		if (this.storage.isCompleted()) {
			console.log("✅ Tour already completed");
			return;
		}

		// Try to resume from saved progress
		const savedProgress = this.storage.getProgress();
		if (savedProgress !== null && savedProgress > 0) {
			console.log("🔄 Resuming tour from step", savedProgress + 1);
			this.currentStepIndex = savedProgress;
		}

		console.log("🚀 Starting tour:", this.tour.title);

		// Track tour start
		this.analytics.track("tour_started", {
			stepIndex: this.currentStepIndex,
		});

		// Enable keyboard navigation
		this.keyboard.enable();

		this.overlay.show();
		this.showStep();
	}

	private showStep(): void {
		const step = this.tour.steps[this.currentStepIndex];
		if (!step) return;

		console.log(`📍 Step ${this.currentStepIndex + 1}:`, step.title);

		// Track step view
		this.analytics.track("step_viewed", {
			stepId: step.id,
			stepIndex: this.currentStepIndex,
		});

		// Find target element
		const targetElement = this.findElement(step.selector);

		if (!targetElement) {
			console.warn("⚠️ Element not found:", step.selector);
			this.analytics.track("tour_error", {
				stepId: step.id,
				stepIndex: this.currentStepIndex,
				metadata: { error: "element_not_found", selector: step.selector },
			});
			// Fallback to center positioning
			this.showTooltipCentered(step);
			return;
		}

		// Scroll to element
		this.scrollToElement(targetElement);

		// Wait for scroll to complete, then position tooltip
		setTimeout(() => {
			// Highlight the element
			this.highlight.highlightElement(targetElement);

			// Calculate optimal position
			const position = this.positionCalculator.calculate(targetElement);

			// Render tooltip content
			this.tooltip.render(
				step,
				this.currentStepIndex + 1,
				this.tour.steps.length
			);

			// Position tooltip next to element
			this.tooltip.setPosition(position.top, position.left, position.placement);
			this.tooltip.show();
		}, 300);
	}

	private findElement(selector: string): Element | null {
		try {
			return document.querySelector(selector);
		} catch (error) {
			console.error("Invalid selector:", selector);
			return null;
		}
	}

	private scrollToElement(element: Element): void {
		element.scrollIntoView({
			behavior: "smooth",
			block: "center",
			inline: "center",
		});
	}

	private showTooltipCentered(step: TourStep): void {
		// Fallback: center tooltip if element not found
		this.tooltip.render(
			step,
			this.currentStepIndex + 1,
			this.tour.steps.length
		);

		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		const scrollY = window.scrollY || document.documentElement.scrollTop;

		this.tooltip.setPosition(
			scrollY + windowHeight / 2 - 100,
			windowWidth / 2 - 200
		);
		this.tooltip.show();
	}

	public next(): void {
		if (this.currentStepIndex < this.tour.steps.length - 1) {
			this.analytics.track("step_next", {
				stepId: this.tour.steps[this.currentStepIndex].id,
				stepIndex: this.currentStepIndex,
			});
			this.currentStepIndex++;
			this.storage.saveProgress(this.currentStepIndex);
			this.showStep();
		} else {
			this.complete();
		}
	}

	public back(): void {
		if (this.currentStepIndex > 0) {
			this.analytics.track("step_back", {
				stepId: this.tour.steps[this.currentStepIndex].id,
				stepIndex: this.currentStepIndex,
			});
			this.currentStepIndex--;
			this.storage.saveProgress(this.currentStepIndex);
			this.showStep();
		}
	}

	public skip(): void {
		console.log("⏭️ Tour closed (progress saved)");
		this.analytics.track("tour_skipped", {
			stepIndex: this.currentStepIndex,
		});
		// Save progress so user can resume later
		this.storage.saveProgress(this.currentStepIndex);
		this.cleanup();
	}

	public dismiss(): void {
		console.log("🚫 Tour permanently dismissed");
		this.analytics.track("tour_skipped", {
			stepIndex: this.currentStepIndex,
			metadata: { permanent: true },
		});
		// Mark as completed to never show again
		this.storage.markCompleted();
		this.cleanup();
	}

	private complete(): void {
		console.log("✅ Tour completed!");
		this.analytics.track("tour_completed");
		this.storage.markCompleted();

		// Hide tooltip and highlight
		this.tooltip.hide();
		this.highlight.hide();

		// Show completion screen
		const completionScreen = new CompletionScreen(() => {
			completionScreen.destroy();
			this.cleanup();
		});
		completionScreen.show();
	}

	private cleanup(): void {
		this.keyboard.disable();
		this.tooltip.destroy();
		this.overlay.destroy();
		this.highlight.destroy();
	}
}
