import { DocumentationComponent } from './documentation/documentation.component';
import { MultiPlayerComponent } from './multi-player/multi-player.component';
import { SinglePlayerComponent } from './single-player/single-player.component';
import { ModuleWithProviders } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

/** Add routes for new angular component here, or as legacy components are replaced */
export const routes: Route[] = [
  { path: 'practice', component: SinglePlayerComponent },
  { path: 'multi-player', component: MultiPlayerComponent },
  { path: 'docs', component: DocumentationComponent },
  { path: '**', redirectTo: '/practice' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
