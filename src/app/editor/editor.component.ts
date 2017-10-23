import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  code: string;
  @Output() saved: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.code = '// initial code goes here';
  }

  ngOnInit() {
  }

  onSave(): void {
    this.saved.emit(this.code);
  }

}
