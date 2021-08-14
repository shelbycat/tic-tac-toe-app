import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TicTacToeComponent } from './games/tic-tac-toe/tic-tac-toe.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'games/t3',
    component: TicTacToeComponent,
  },
  {
    path: '*',
    redirectTo: 'home',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
