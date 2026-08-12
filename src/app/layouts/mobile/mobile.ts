import { Component } from '@angular/core';

import { BarreNavigation } from "../../components/barre-navigation/barre-navigation";
import { RouterOutlet } from '@angular/router';
import { Header } from "../../components/header/header";

@Component({
  selector: 'app-mobile',
  imports: [RouterOutlet, BarreNavigation, Header],
  templateUrl: './mobile.html',
  styleUrl: './mobile.css',
})
export class Mobile {}
