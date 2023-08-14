
import { Component, Input, Output, EventEmitter, HostListener } from "@angular/core";
import { ContextMenuModel } from "../interfaces/context-menu-model";

@Component({
  selector: "app-context-menu",
  templateUrl: "./context-menu.component.html",
  styleUrls: ["./context-menu.component.scss"],
})
export class ContextMenuComponent {
  @Input()
  contextMenuItems!: Array<ContextMenuModel>;
  @Input()
  element!: any;
  @Input()
  activated!: boolean;

  @Output()
  onContextMenuItemClick: EventEmitter<any> = new EventEmitter<any>();

  onContextMenuClick(event: any, data: any): any {
    this.onContextMenuItemClick.emit({
      event,
      data,
      target: this.element
    });
  }

  createElement(element: any) {
    return document.createElement(element);
  }
}
