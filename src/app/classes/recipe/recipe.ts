export class Recipe {
  _id: string = '';
  name: string = '';
  description: string = '';
  ingredients: string[] = [];
  preparationTime: number = 0;
  steps: string[] = [];
  image: string = '';

  constructor() { }
}
