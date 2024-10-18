import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <router-outlet></router-outlet> <!-- This will render your routed components -->
  `,
  imports: [RouterModule]
})
export class AppComponent {}
