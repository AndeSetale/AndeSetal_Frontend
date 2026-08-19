import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationCitoyen } from "../../features/citoyen/components/navigation-citoyen/navigation-citoyen";

@Component({
  selector: 'app-mobile',
  standalone: true,
  imports: [RouterOutlet, NavigationCitoyen],
  templateUrl: './mobile.html',
  styleUrl: './mobile.css',
})
export class Mobile {}
