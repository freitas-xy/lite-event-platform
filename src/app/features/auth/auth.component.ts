import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet],
  standalone: true,
  templateUrl: './auth.component.html',
})
export class AuthPage {}
