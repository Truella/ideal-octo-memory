import type { TourStep } from "../types";

export class Tooltip {
	private element: HTMLDivElement;
	private onNext: () => void;
	private onBack: () => void;
	private onSkip: () => void;
	private onDismiss?: () => void;

	constructor(
		onNext: () => void,
		onBack: () => void,
		onSkip: () => void,
		onDismiss?: () => void
	) {
		this.onNext = onNext;
		this.onBack = onBack;
		this.onSkip = onSkip;
		this.onDismiss = onDismiss;
		this.element = this.createTooltip();
	}

	private createTooltip(): HTMLDivElement {
		const tooltip = document.createElement("div");
		tooltip.className = "tour-tooltip";

		const dismissButton = this.onDismiss
			? '<button class="tour-btn-dismiss" title="Don\'t show this tour again">Don\'t show again</button>'
			: "";

		tooltip.innerHTML = `
      <div class="tour-tooltip-header">
        <h3 class="tour-tooltip-title"></h3>
        <button class="tour-tooltip-close" aria-label="Close tour">×</button>
      </div>
      <div class="tour-tooltip-content"></div>
      <div class="tour-tooltip-footer">
        <div class="tour-tooltip-progress"></div>
        <div class="tour-tooltip-actions">
          ${dismissButton}
          <button class="tour-btn tour-btn-back">Back</button>
          <button class="tour-btn tour-btn-next">Next</button>
        </div>
      </div>
    `;

		// Event listeners
		tooltip
			.querySelector(".tour-btn-next")
			?.addEventListener("click", this.onNext);
		tooltip
			.querySelector(".tour-btn-back")
			?.addEventListener("click", this.onBack);
		tooltip
			.querySelector(".tour-tooltip-close")
			?.addEventListener("click", this.onSkip);

		if (this.onDismiss) {
			tooltip
				.querySelector(".tour-btn-dismiss")
				?.addEventListener("click", this.onDismiss);
		}

		return tooltip;
	}

	public render(step: TourStep, currentStep: number, totalSteps: number): void {
		const title = this.element.querySelector(".tour-tooltip-title");
		const content = this.element.querySelector(".tour-tooltip-content");
		const progress = this.element.querySelector(".tour-tooltip-progress");
		const backBtn = this.element.querySelector(
			".tour-btn-back"
		) as HTMLButtonElement;
		const nextBtn = this.element.querySelector(
			".tour-btn-next"
		) as HTMLButtonElement;

		if (title) title.textContent = step.title;
		if (content) content.textContent = step.content;
		if (progress) progress.textContent = `${currentStep} / ${totalSteps}`;

		// Update button states
		if (backBtn) backBtn.disabled = currentStep === 1;
		if (nextBtn)
			nextBtn.textContent = currentStep === totalSteps ? "Finish" : "Next";
	}

	public setPosition(top: number, left: number, placement?: string): void {
		this.element.style.top = `${top}px`;
		this.element.style.left = `${left}px`;

		// Set placement attribute for arrow positioning
		if (placement) {
			this.element.setAttribute("data-placement", placement);
		}
	}

	public show(): void {
		if (!document.body.contains(this.element)) {
			document.body.appendChild(this.element);
		}
		this.element.style.display = "block";
	}

	public hide(): void {
		this.element.style.display = "none";
	}

	public destroy(): void {
		this.element.remove();
	}
}
