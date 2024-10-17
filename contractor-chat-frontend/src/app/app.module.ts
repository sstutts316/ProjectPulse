import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { HttpClientModule } from '@angular/common/http'; // For HTTP services
import { RouterModule } from '@angular/router'; // For routing

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ChatComponent } from './components/chat/chat.component';
import { routes } from './app.routes'; // Import routes

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule, // Include FormsModule here
    HttpClientModule,
    RouterModule.forRoot(routes), // Use RouterModule for the app's routes
  ],
  providers: [],
  bootstrap: [AppComponent], // Main component to bootstrap
})
export class AppModule {}
