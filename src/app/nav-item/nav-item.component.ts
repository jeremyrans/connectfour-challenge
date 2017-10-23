import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.css']
})
export class NavItemComponent implements OnInit {
  @Input() label: string;
  @Input() href: string;
  @Input() active = false;
  @Output() change = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

}
