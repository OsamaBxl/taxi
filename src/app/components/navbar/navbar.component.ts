import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  fixedNav = false;
  currentLang: string = '';

  constructor(public translate: TranslateService) {
    this.currentLang = localStorage.getItem('currentLang') || 'fr';
    this.translate.use(this.currentLang);
  }

  changeCurrentLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('currentLang', lang);
  }

  ngOnInit() {}

  @HostListener('window:scroll', []) onWindowScroll() {
    // do some stuff here when the window is scrolled
    if (window.scrollY >= 90) {
      this.fixedNav = true;
    } else {
      this.fixedNav = false;
    }
  }
}
