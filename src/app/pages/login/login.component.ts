import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: string = 'testeusername';
  password: string = 'testesenha';

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  authenticateUser(): void {
    if (this.username === 'testeusername' && this.password === 'testesenha') {
      console.log('autenticado')
      this.router.navigate(['/receitas'])
    } else {
      console.log('acesso negado')
    }
  }
}
