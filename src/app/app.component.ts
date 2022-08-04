import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';


type Theme = 'light' | 'dark';


@Component({
    selector: 'poke-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ]
})
export class AppComponent {

    theme: Theme;

    constructor(@Inject(DOCUMENT) private document: Document) {
        const bodyClassList = this.document.body.classList;
        if (bodyClassList.contains('poke-dark')) {
            this.theme = 'dark';
        } else {
            this.theme = 'light';
        }

        const savedTheme = localStorage.getItem('poke_theme');
        if (savedTheme && savedTheme !== this.theme) {
            this.setTheme(savedTheme as Theme);
        }
    }

    toggleTheme(): void {
        if (this.theme === 'light') {
            this.setTheme('dark');
        } else {
            this.setTheme('light');
        }
    }

    setTheme(theme: Theme): void {
        if (this.document.body.classList.contains('poke-' + this.theme)) {
            this.document.body.classList.remove('poke-' + this.theme);
        }

        this.document.body.classList.add('poke-' + theme);
        localStorage.setItem('poke_theme', theme);
        this.theme = theme;
    }

}
