/* Creates a spotlight effect around target element
 * Uses box-shadow trick to dim everything except the target
 */
export class Highlight {
	private element: HTMLDivElement;

	constructor() {
		this.element = this.createHighlight();
	}

	private createHighlight(): HTMLDivElement {
		const highlight = document.createElement("div");
		highlight.className = "tour-highlight";
		return highlight;
	}
	public highlightElement(targetElement: Element): void {
		const rect = targetElement.getBoundingClientRect();
		const scrollY = window.scrollY || document.documentElement.scrollTop;
		const scrollX = window.scrollX || document.documentElement.scrollLeft;

		this.element.style.top = `${rect.top + scrollY}px`;
		this.element.style.left = `${rect.left + scrollX}px`;
		this.element.style.width = `${rect.width}px`;
		this.element.style.height = `${rect.height}px`;
		this.element.style.border = "2px solid #4f46e5";
		this.element.style.borderRadius = "4px";

		this.show();
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
