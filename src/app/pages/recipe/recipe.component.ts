import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {Recipe} from "../../classes/recipe/recipe";

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {
  recipeId: string = "";
  recipe: Recipe = new Recipe;
  lastIngredient = -1;
  lastStep = -1;
  loading: Boolean = false;
  private sub: any

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.sub = this.route.params.subscribe(params => {
      this.recipeId = params['id']
    })
    this.http
      .get('http://localhost:80/recipe/' + this.recipeId)
      .pipe(catchError(this.handleError))
      .subscribe((data: Object) => {
        this.recipe = JSON.parse(JSON.stringify(data));
      });
    this.loading = false;
  }

  setLastIngredient(index: number): void {
    if (index === this.lastIngredient) {
      this.lastIngredient -= 1;
    } else if (index === this.lastIngredient + 1) {
      this.lastIngredient = index;
    } else {
      console.log("Complete os outros ingredientes antes")
    }
  }

  ingredientsClass(index: number): string {
    if (index <= this.lastIngredient) {
      return 'fa-solid fa-2x fa-circle-check green-icon'
    } else {
      return 'fa-solid fa-2x fa-circle white-icon'
    }
  }

  setLastStep(index: number): void {
    if (this.lastIngredient !== this.recipe.ingredients.length-1) {
      console.log("Pegue todos os ingredientes antes")
      return
    }
    if (index === this.lastStep) {
      this.lastStep -= 1;
    } else if (index === this.lastStep + 1) {
      this.lastStep = index;
    } else {
      console.log("Complete os outros passos antes")
    }
  }

  stepsClass(index: number): string {
    if (index <= this.lastStep) {
      return 'fa-solid fa-2x fa-circle-check green-icon'
    } else {
      return 'fa-solid fa-2x fa-circle white-icon'
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
