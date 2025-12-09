export interface TourStep {
	id: string;
	selector: string;
	title: string;
	content: string;
}

export interface Tour {
	id: string;
	title: string;
	steps: TourStep[];
}

export interface TooltipPosition {
	top: number;
	left: number;
	placement: "top" | "bottom" | "left" | "right";
}
