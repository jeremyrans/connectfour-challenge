import { TournamentService } from './tournament/tournament.service';
import { SandboxService } from './sandbox/sandbox.service';
import { UserService } from './user/user.service';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { environment } from '../environments/environment';
import { routing } from './app.routes';
import { RouterModule } from '@angular/router';
import { ConnectFourService } from './connect-four/connect-four.service';
import { ConnectFourDirective } from './connect-four/connect-four.directive';
import { PlayerService } from './player/player.service';
import {
  MatCardModule, MatButtonModule, MatSliderModule,
  MatToolbarModule, MatSelectModule, MatRadioModule, MatInputModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AceEditorModule } from 'ng2-ace-editor';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConnectFourBoardComponent } from './connect-four-board/connect-four-board.component';
import { SinglePlayerComponent } from './single-player/single-player.component';
import { MultiPlayerComponent } from './multi-player/multi-player.component';
import { NavComponent } from './nav/nav.component';
import { NavItemComponent } from './nav-item/nav-item.component';
import { DocumentationComponent } from './documentation/documentation.component';
import 'hammerjs';
import { TournamentComponent } from './tournament/tournament.component';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    ConnectFourBoardComponent,
    ConnectFourDirective,
    SinglePlayerComponent,
    MultiPlayerComponent,
    NavComponent,
    NavItemComponent,
    DocumentationComponent,
    TournamentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AceEditorModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatSliderModule,
    MatSelectModule,
    MatRadioModule,
    MatToolbarModule,
    MatInputModule,
    RouterModule,
    routing,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpClientModule
  ],
  providers: [
    PlayerService,
    ConnectFourService,
    UserService,
    SandboxService,
    TournamentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
