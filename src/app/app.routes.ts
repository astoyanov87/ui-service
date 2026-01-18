import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MatchDetailsComponent } from './pages/match-details/match-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'match/:id', component: MatchDetailsComponent },
  { path: '**', redirectTo: '' }
];
