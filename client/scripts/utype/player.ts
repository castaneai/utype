/// <reference  path="interface.d.ts" />

module utype {
	export class Player {

		public intervalScore: { kanaSolvedCount: number } = {
			kanaSolvedCount: 0
		};

		public score: Score = {
			point: 0,
			missCount: 0
		};
		
		constructor() {
		}
	}
}
