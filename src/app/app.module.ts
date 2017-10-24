import { UserService } from './user/user.service';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { environment } from '../environments/environment';
import { routing } from './app.routes';
import { RouterModule } from '@angular/router';
import { ConnectFourService } from './connect-four/connect-four.service';
import { ConnectFourDirective } from './connect-four/connect-four.directive';
import { PlayerService } from './player/player.service';
import { MatCardModule, MatButtonModule, MatToolbarModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AceEditorModule } from 'ng2-ace-editor';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { FormsModule } from '@angular/forms';
import { ConnectFourComponent } from './connect-four/connect-four.component';
import { ConnectFourBoardComponent } from './connect-four-board/connect-four-board.component';
import { SinglePlayerComponent } from './single-player/single-player.component';
import { MultiPlayerComponent } from './multi-player/multi-player.component';
import { NavComponent } from './nav/nav.component';
import { NavItemComponent } from './nav-item/nav-item.component';
import { DocumentationComponent } from './documentation/documentation.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    ConnectFourComponent,
    ConnectFourBoardComponent,
    ConnectFourDirective,
    SinglePlayerComponent,
    MultiPlayerComponent,
    NavComponent,
    NavItemComponent,
    DocumentationComponent
  ],
  imports: [
    BrowserModule,
    AceEditorModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    RouterModule,
    routing,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [
    PlayerService,
    ConnectFourService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
