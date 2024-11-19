import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'JailTracker';
  pingResponse: string = '';

  constructor(private apiService: ApiService) {}

  testPing() {
    console.log("Test Ping clicked");
    this.apiService.ping().subscribe(
      (response) => {
        console.log("Ping response:", response);
        this.pingResponse = response;
      },
      (error) => {
        console.error("Ping error:", error);
      }
    );
  }
}
