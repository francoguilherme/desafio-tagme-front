import { Component, OnInit } from '@angular/core';
import { Recipe } from "../../classes/recipe/recipe";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {
  recipes: Array<Recipe> = [];
  searchQuery: string = '';
  loading: Boolean = false;
  error: Boolean = false;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.http
      .get<Recipe[]>('http://localhost:80/recipe')
      .pipe(catchError(this.handleError))
      .subscribe((data) => {
        this.recipes = data;
        this.loading = false;
      });
  }

  get queriedRecipes(): Array<Recipe> {
    if (!this.searchQuery) return this.recipes;
    let regexQuery = new RegExp(this.searchQuery.trim(), 'i');
    return this.recipes.filter(recipe => regexQuery.test(recipe.name));
  }

  private handleError = (error: HttpErrorResponse) => {
    this.loading = false;
    this.error = true;
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
