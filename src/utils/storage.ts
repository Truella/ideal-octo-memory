export class TourStorage {
	private storageKey: string;

	constructor(tourId: string) {
		this.storageKey = `tour_progress_${tourId}`;
	}

	/*Save current step progress*/
	public saveProgress(stepIndex: number): void {
		try {
			localStorage.setItem(
				this.storageKey,
				JSON.stringify({
					stepIndex,
					timestamp: Date.now(),
				})
			);
		} catch (error) {
			console.warn("Unable to save tour progress:", error);
		}
	}

	/* Get saved progress*/
	public getProgress(): number | null {
		try {
			const data = localStorage.getItem(this.storageKey);
			if (!data) return null;

			const parsed = JSON.parse(data);

			// Only resume if less than 7 days old
			const sevenDays = 7 * 24 * 60 * 60 * 1000;
			if (Date.now() - parsed.timestamp > sevenDays) {
				this.clearProgress();
				return null;
			}

			return parsed.stepIndex;
		} catch (error) {
			console.warn("Unable to read tour progress:", error);
			return null;
		}
	}

	/* Mark tour as completed*/
	public markCompleted(): void {
		try {
			localStorage.setItem(
				this.storageKey,
				JSON.stringify({
					completed: true,
					timestamp: Date.now(),
				})
			);
		} catch (error) {
			console.warn("Unable to mark tour as completed:", error);
		}
	}

	/* Check if tour was completed*/
	public isCompleted(): boolean {
		try {
			const data = localStorage.getItem(this.storageKey);
			if (!data) return false;

			const parsed = JSON.parse(data);
			return parsed.completed === true;
		} catch (error) {
			return false;
		}
	}

	/* Clear all progress*/
	public clearProgress(): void {
		try {
			localStorage.removeItem(this.storageKey);
		} catch (error) {
			console.warn("Unable to clear tour progress:", error);
		}
	}
}
