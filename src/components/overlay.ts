export class Overlay {
	private element: HTMLDivElement;

	constructor() {
		this.element = this.createOverlay();
	}

	private createOverlay(): HTMLDivElement {
		const overlay = document.createElement("div");
		overlay.className = "tour-overlay";
		return overlay;
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
