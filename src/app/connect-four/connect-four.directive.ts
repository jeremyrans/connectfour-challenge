import { ConnectFourService } from './connect-four.service';
import { Directive } from '@angular/core';

@Directive({
  selector: '[appConnectFour]',
  providers: [ConnectFourService]
})
export class ConnectFourDirective { }
