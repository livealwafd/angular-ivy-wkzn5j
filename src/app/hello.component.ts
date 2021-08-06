import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { PrimeNGConfig } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { AuthService } from './shared/modules/user/services/auth/auth.service';
import { ConstantsStoreService } from './shared/services/constants-store.service';
import { TranslationService } from './shared/services/translation/translation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'lingoseo';

  currentLang;

  searechDropDown = false;
  showMenuMobile = false;
  loadLang = false;
  shownav = true;

  constructor(
    private renderer: Renderer2,
    private primengConfig: PrimeNGConfig,
    private authSer: AuthService,
    private constantsStoreSer: ConstantsStoreService,
    private _router: Router,
    @Inject(DOCUMENT) private document: Document,
    private translationService: TranslationService
  ) {}
  ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.currentLang =
      localStorage.getItem('currentLang') || environment.defaultLanguage;
    this.renderer.setAttribute(
      document.querySelector('html'),
      'lang',
      this.currentLang
    );
    this.loadStyle(`assets/css/bootstrap_${this.currentLang}.css`);
    // this.renderer.setAttribute(document.getElementById('boostrap_style'), 'href', '../../../../assets/css/bootstrap_en.css');
    // this.translationService.currentLang$.subscribe(res => {
    //   console.log('res lang', res)
    // })
    this.constantsStoreSer.getData();
  }

  changeCurrentLang(lang) {
    this.loadLang = true;
    localStorage.setItem('currentLang', lang);
    this.currentLang = localStorage.getItem('currentLang');
    // this.renderer.setAttribute(document.querySelector('html'), 'lang', this.currentLang);
    // this.loadStyle(`assets/css/bootstrap_${this.currentLang}.css`)

    let newRoute = this._router['location']['_platformLocation']['location'][
      'pathname'
    ].replace(/^.{3}/g, `${lang}`);
    this.document.documentElement.lang = localStorage.getItem('currentLang');
    this.translationService.language = localStorage.getItem('currentLang');
    // this._router.navigateByUrl(newRoute);
    window.location.href = newRoute;
  }

  loadStyle(styleName: string) {
    const head = this.document.getElementsByTagName('head')[0];

    let themeLink = this.document.getElementById(
      'boostrap_style'
    ) as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = styleName;
    } else {
      const style = this.document.createElement('link');
      style.id = 'boostrap_style';
      style.rel = 'stylesheet';
      style.href = `${styleName}`;

      head.appendChild(style);
    }
  }
}
