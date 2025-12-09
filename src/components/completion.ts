/*Completion screen shown when tour finishes*/
export class CompletionScreen {
	private element: HTMLDivElement;
	private onClose: () => void;

	constructor(onClose: () => void) {
		this.onClose = onClose;
		this.element = this.createScreen();
	}

	private createScreen(): HTMLDivElement {
		const screen = document.createElement("div");
		screen.className = "tour-completion";
		screen.innerHTML = `
      <div class="tour-completion-content">
        <div class="tour-completion-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 12l2 2 4-4"></path>
          </svg>
        </div>
        <h2 class="tour-completion-title">Tour Completed! 🎉</h2>
        <p class="tour-completion-message">You've successfully completed the tour. You're all set to explore!</p>
        <button class="tour-btn tour-btn-primary tour-completion-btn">Got it</button>
      </div>
    `;

		// Event listener
		screen
			.querySelector(".tour-completion-btn")
			?.addEventListener("click", this.onClose);

		return screen;
	}

	public show(): void {
		if (!document.body.contains(this.element)) {
			document.body.appendChild(this.element);
		}
		this.element.style.display = "flex";
	}

	public hide(): void {
		this.element.style.display = "none";
	}

	public destroy(): void {
		this.element.remove();
	}
}
