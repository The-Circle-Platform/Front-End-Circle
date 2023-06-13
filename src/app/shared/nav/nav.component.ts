import { Component, Input, OnInit } from '@angular/core';


@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
    @Input() title!: string;
    isNavbarCollapsed = true;

    constructor() {}

    ngOnInit(): void {}

    logout(): void {}
}
