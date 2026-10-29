import { Component } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { HeaderDashboard } from "../../components/header-dashboard/header-dashboard";

@Component({
  selector: 'app-dashboard',
  imports: [Sidebar, RouterOutlet, HeaderDashboard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
