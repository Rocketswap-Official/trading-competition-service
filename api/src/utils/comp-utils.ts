const structure_percents = [0.4, 0.2, 0.1, 0.075, 0.05, 0.05, 0.025, 0.025, 0.025, 0.025, 0.025];

function calcPayoutStructure(amount: number, structure_percents: number[]) {
	const sum = structure_percents.reduce((a, b) => a + b, 0);
	const structure = structure_percents.map((p) => {
		return Math.floor(amount * (p / sum));
	});
	return structure;
}

export function returnPayoutStructure(amount: number) {
	const structure = calcPayoutStructure(amount, structure_percents);
	return structure;
}
