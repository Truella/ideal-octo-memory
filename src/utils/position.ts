import type { TooltipPosition } from "../types";

export class PositionCalculator {
	private tooltipWidth = 400;
	private tooltipHeight = 200; // Approximate
	private padding = 16; // Space between element and tooltip

	/**
	 * Calculate the best position for the tooltip relative to target element
	 */
	public calculate(element: Element): TooltipPosition {
		const rect = element.getBoundingClientRect();
		const scrollY = window.scrollY || document.documentElement.scrollTop;
		const scrollX = window.scrollX || document.documentElement.scrollLeft;

		// Absolute positions
		const elementTop = rect.top + scrollY;
		const elementLeft = rect.left + scrollX;
		const elementWidth = rect.width;
		const elementHeight = rect.height;

		// Try positions in order of preference: bottom, top, right, left
		const positions = [
			this.calculateBottom(
				elementTop,
				elementLeft,
				elementWidth,
				elementHeight
			),
			this.calculateTop(elementTop, elementLeft, elementWidth),
			this.calculateRight(elementTop, elementLeft, elementWidth, elementHeight),
			this.calculateLeft(elementTop, elementLeft, elementHeight),
		];

		// Return first position that fits in viewport
		return positions.find((pos) => this.fitsInViewport(pos)) || positions[0];
	}

	private calculateBottom(
		top: number,
		left: number,
		width: number,
		height: number
	): TooltipPosition {
		return {
			top: top + height + this.padding,
			left: left + width / 2 - this.tooltipWidth / 2,
			placement: "bottom",
		};
	}

	private calculateTop(
		top: number,
		left: number,
		width: number
	): TooltipPosition {
		return {
			top: top - this.tooltipHeight - this.padding,
			left: left + width / 2 - this.tooltipWidth / 2,
			placement: "top",
		};
	}

	private calculateRight(
		top: number,
		left: number,
		width: number,
		height: number
	): TooltipPosition {
		return {
			top: top + height / 2 - this.tooltipHeight / 2,
			left: left + width + this.padding,
			placement: "right",
		};
	}

	private calculateLeft(
		top: number,
		left: number,
		height: number
	): TooltipPosition {
		return {
			top: top + height / 2 - this.tooltipHeight / 2,
			left: left - this.tooltipWidth - this.padding,
			placement: "left",
		};
	}

	private fitsInViewport(position: TooltipPosition): boolean {
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;
		const scrollY = window.scrollY || document.documentElement.scrollTop;

		// Check horizontal fit
		if (
			position.left < 0 ||
			position.left + this.tooltipWidth > viewportWidth
		) {
			return false;
		}

		// Check vertical fit (relative to current scroll position)
		const relativeTop = position.top - scrollY;
		if (relativeTop < 0 || relativeTop + this.tooltipHeight > viewportHeight) {
			return false;
		}

		return true;
	}
}
