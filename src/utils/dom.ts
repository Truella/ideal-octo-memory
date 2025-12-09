/**
 * DOM utility functions
 */

/**
 * Safely query selector with error handling
 */
export function safeQuerySelector(selector: string): Element | null {
	try {
		return document.querySelector(selector);
	} catch (error) {
		console.error("Invalid selector:", selector, error);
		return null;
	}
}

/**
 * Check if element is visible in viewport
 */
export function isElementVisible(element: Element): boolean {
	const rect = element.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= window.innerHeight &&
		rect.right <= window.innerWidth
	);
}

/**
 * Get element's absolute position
 */
export function getElementPosition(element: Element): {
	top: number;
	left: number;
	width: number;
	height: number;
} {
	const rect = element.getBoundingClientRect();
	const scrollY = window.scrollY || document.documentElement.scrollTop;
	const scrollX = window.scrollX || document.documentElement.scrollLeft;

	return {
		top: rect.top + scrollY,
		left: rect.left + scrollX,
		width: rect.width,
		height: rect.height,
	};
}

/**
 * Smooth scroll to element with offset
 */
export function scrollToElement(element: Element, offset: number = 0): void {
	const rect = element.getBoundingClientRect();
	const scrollTop = window.scrollY || document.documentElement.scrollTop;
	const targetPosition = rect.top + scrollTop - offset;

	window.scrollTo({
		top: targetPosition,
		behavior: "smooth",
	});
}

/**
 * Wait for element to appear in DOM
 */
export async function waitForElement(
	selector: string,
	timeout: number = 5000
): Promise<Element | null> {
	const startTime = Date.now();

	while (Date.now() - startTime < timeout) {
		const element = safeQuerySelector(selector);
		if (element) return element;

		await new Promise((resolve) => setTimeout(resolve, 100));
	}

	return null;
}
