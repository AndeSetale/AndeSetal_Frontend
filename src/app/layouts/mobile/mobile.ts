import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationCitoyen } from "../../features/citoyen/components/navigation-citoyen/navigation-citoyen";
import { HeaderCitoyen } from "../../features/citoyen/components/header-citoyen/header-citoyen";

@Component({
  selector: 'app-mobile',
  imports: [RouterOutlet, NavigationCitoyen],
  templateUrl: './mobile.html',
  styleUrl: './mobile.css',
})
export class Mobile {}
