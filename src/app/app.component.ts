import { Component, HostListener, ViewChild } from '@angular/core';
import { ContextMenuModel } from './interfaces/context-menu-model';
import { BehaviorSubject, debounceTime, fromEvent } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'context-menu';

  isDisplayContextMenu!: boolean;
  rightClickMenuItems: Array<ContextMenuModel> = [];
  rightClickMenuPositionX!: number;
  rightClickMenuPositionY!: number;
  targetElement: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  @ViewChild('container') container!: HTMLDivElement;

  displayContextMenu(event: any) {
    this.targetElement.next(event.target);
    this.isDisplayContextMenu = true;

    this.rightClickMenuItems = [
      {
        menuText: 'New Element',
        menuIcon: 'add',
      },
      {
        menuText: 'Attributes',
        menuIcon: 'code',
      },
      {
        menuText: 'Style',
        menuIcon: 'color-palette-outline',
      },
      {
        menuText: 'Lock',
        menuIcon: 'lock-closed-outline',
      }
    ];

    this.rightClickMenuPositionX = event.clientX;
    this.rightClickMenuPositionY = event.clientY;

  }

  getRightClickMenuStyle() {
    return {
      position: 'fixed',
      left: `${this.rightClickMenuPositionX}px`,
      top: `${this.rightClickMenuPositionY}px`
    }
  }

  handleMenuItemClick(event: any) {
    switch (event.data) {
      case this.rightClickMenuItems[0].menuIcon:
           let element = prompt('Enter the element name');
           if (!element) {
             return;
           }
            let newElement = document.createElement(element as string);
            //generate random id here
            newElement.id = (Math.random() + 1).toString(36).substring(7);
            newElement.innerHTML = 'New Element';
            newElement.style.border = '1px solid black';
            newElement.setAttribute('draggable', 'true')
            newElement.setAttribute('contenteditable', 'true')
            fromEvent(newElement, 'DOMCharacterDataModified').pipe(
              debounceTime(2000) // 2 seconds
            ).subscribe((ev) => {
              //find all html tags and contents
              let htmlTags = (ev.target as Element)?.textContent?.match(/<(\/?\w+)(?:\s+[^>]*|)>([^<]*)<\/\1>/g);
              console.log(htmlTags);
              newElement.appendChild(new DOMParser().parseFromString(htmlTags?.[0] as string, 'text/html'));
            });
            newElement.addEventListener("dragstart", (ev: DragEvent) => {
              // Change the source element's background color
              // to show that drag has started
              (ev.currentTarget as Element)?.classList.add("dragging");
              // Clear the drag data cache (for all formats/types)
              ev.dataTransfer?.clearData();
              // Set the drag's format and data.
              // Use the event target's id for the data
              ev.dataTransfer?.setData("text/plain", (ev.target as Element)?.id);
            });
            newElement.addEventListener("dragend", (ev: DragEvent) =>
              (ev.target as Element)?.classList.remove("dragging"),
            );
            newElement.addEventListener("dragover", (ev) => {
              ev.preventDefault();
            });
            newElement.addEventListener("drop", (ev) => {
              ev.preventDefault();
              // Get the data, which is the id of the source element
              const data = ev.dataTransfer?.getData("text");
              const source = document.getElementById(data as string);
              (ev.target as Element)?.appendChild(source as Node);
            });
            event.target.prepend(newElement);
           break;
      case this.rightClickMenuItems[1].menuIcon:
            let attributeToAdd = prompt('Enter an attribute to add:');
            let valueForAttribute = prompt('Enter a value for the attribute:');
            if(!attributeToAdd || !valueForAttribute) {
              return;
            }
            event.target.setAttribute(attributeToAdd as string, valueForAttribute as string);
            break;
      case this.rightClickMenuItems[2].menuIcon:
            let styleToAdd = prompt('Enter a style tag to add:');
            let valueToAdd = prompt('Enter a value for the style tag:');
            if(!styleToAdd || !valueToAdd) {
              return;
            }
            event.target.style[styleToAdd as string] = valueToAdd;
            break;
      case this.rightClickMenuItems[3].menuIcon:
            event.target.setAttribute('draggable', 'false');
            event.target.setAttribute('contenteditable', 'false');
            break;
    }
  }

  @HostListener('document:click')
  documentClick(): void {
    this.isDisplayContextMenu = false;
  }
}
