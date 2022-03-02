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
  collectedIngredients: number[] = [];
  lastStep = -1;
  loading: Boolean = false;
  preparing: Boolean = false;
  timer: number = 0;

  modalText: string = "";
  modalButtonText: string = "";
  modalOpen: boolean = false;

  private sub: any;
  private timeout: any;
  private startTime: Date = new Date();

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
        this.loading = false;
      });
  }

  addIngredient(index: number): void {
    if (!this.collectedIngredients.includes(index)) {
      this.collectedIngredients.push(index);
    } else {
      let found = this.collectedIngredients.findIndex(i => i === index);
      this.collectedIngredients.splice(found, 1);
    }
  }

  ingredientsClass(index: number): string {
    if (this.collectedIngredients.includes(index)) {
      return 'fa-solid fa-2x fa-circle-check green-icon'
    } else {
      return 'fa-solid fa-2x fa-circle white-icon'
    }
  }

  setLastStep(index: number): void {
    if (this.collectedIngredients.length < this.recipe.ingredients.length) {
      this.modalText = "Para iniciar a preparação, certifique-se de que você tem todos os ingredientes selecionados!";
      this.modalButtonText = "Entendi";
      this.modalOpen = true;
      return
    }
    if (!this.preparing) {
      this.modalText = "Para iniciar a preparação, clique no botão 'Iniciar preparação' no fim da página.";
      this.modalButtonText = "Entendi";
      this.modalOpen = true;
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

  startPreparing(): void {
    if (this.collectedIngredients.length < this.recipe.ingredients.length) {
      this.modalText = "Para iniciar a preparação, certifique-se de que você tem todos os ingredientes selecionados!";
      this.modalButtonText = "Entendi";
      this.modalOpen = true;
      return
    }
    this.preparing = true;
    this.startTime = new Date();
    this.timeout = setInterval(() => {
      this.timer += 1;
    }, 1000*60)
  }

  finishRecipe(): void {
    if (this.lastStep !== this.recipe.steps.length-1) {
      this.modalText = "Para finalizar, certifique-se de que você completou todos os passos.";
      this.modalButtonText = "Entendi";
      this.modalOpen = true;
      return
    }
    let diffTime = Math.abs(new Date().valueOf() - this.startTime.valueOf());
    let days = diffTime / (24*60*60*1000);
    let hours = (days % 1) * 24;
    let minutes = (hours % 1) * 60;
    let secs = (minutes % 1) * 60;
    [minutes, secs] = [Math.floor(minutes), Math.floor(secs)]
    this.modalText = `Obrigado\n\nPrato finalizado com sucesso em ${minutes} minutos e ${secs} segundos!`;
    this.modalButtonText = "OK";
    this.modalOpen = true;
    clearTimeout(this.timeout)
    //TODO Voltar tela ou limpar essa
  }

  get footerClass(): string {
    if (this.collectedIngredients.length && this.lastStep >= 0) {
      return 'sticky-bottom'
    } else {
      return ''
    }
  }

  get preparationProgress(): number {
    return Math.round((this.lastStep+1)/this.recipe.steps.length*100)
  }

  get preparationMinutes(): number {
    return this.timer
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private handleError(error: HttpErrorResponse) {
    this.loading = false;
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
