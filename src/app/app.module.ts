import { ConnectFourService } from './connect-four/connect-four.service';
import { ConnectFourDirective } from './connect-four/connect-four.directive';
import { PlayerService } from './player/player.service';
import { MatCardModule, MatButtonModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AceEditorModule } from 'ng2-ace-editor';

import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { FormsModule } from '@angular/forms';
import { ConnectFourComponent } from './connect-four/connect-four.component';
import { ConnectFourBoardComponent } from './connect-four-board/connect-four-board.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    ConnectFourComponent,
    ConnectFourBoardComponent,
    ConnectFourDirective
  ],
  imports: [
    BrowserModule,
    AceEditorModule,
    FormsModule,
    MatCardModule,
    MatButtonModule
  ],
  providers: [
    PlayerService,
    ConnectFourService
    // {
    //   provide: 'connectFourService',
    //   useFactory: () => () => new ConnectFourService(),
    //   deps: []
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
