import { Component } from '@angular/core';
import { CarteIncidentsComponent } from "../carte-incidents/carte-incidents/carte-incidents";

@Component({
  selector: 'app-carte',
  imports: [CarteIncidentsComponent],
  templateUrl: './carte.html',
  styleUrl: './carte.css',
})
export class Carte {}
