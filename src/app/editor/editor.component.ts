import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  code: string;
  codemirrorConfig = {
    mode: 'javascript',
    lineNumbers: true,
    gutters: ['CodeMirror-lint-markers'],
    lint: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    highlightSelectionMatches: { showToken: /\w/ },
    viewportMargin: Infinity
  };

  constructor() {
    this.code = '// initial code goes here';
  }

  ngOnInit() {
  }

}
