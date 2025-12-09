/**
 * Keyboard navigation handler
 * ESC - Close tour (saves progress)
 * Arrow Right/Enter - Next step
 * Arrow Left - Previous step
 */
export class KeyboardHandler {
	private onNext: () => void;
	private onBack: () => void;
	private onClose: () => void;
	private boundHandler: (e: KeyboardEvent) => void;

	constructor(onNext: () => void, onBack: () => void, onClose: () => void) {
		this.onNext = onNext;
		this.onBack = onBack;
		this.onClose = onClose;
		this.boundHandler = this.handleKeyPress.bind(this);
	}

	private handleKeyPress(event: KeyboardEvent): void {
		switch (event.key) {
			case "Escape":
				event.preventDefault();
				this.onClose();
				break;

			case "ArrowRight":
			case "Enter":
				event.preventDefault();
				this.onNext();
				break;

			case "ArrowLeft":
				event.preventDefault();
				this.onBack();
				break;
		}
	}

	public enable(): void {
		document.addEventListener("keydown", this.boundHandler);
	}

	public disable(): void {
		document.removeEventListener("keydown", this.boundHandler);
	}
}
