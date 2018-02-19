'use strict';

import {PartThemeMixin} from './libs/part-theme.js';

export class PartThemeElement extends PartThemeMixin(HTMLElement) {
    static get template() {
      return ``;
    }
    connectedCallback() {
      if (!this.shadowRoot) {
        const template = this.constructor.template;
        if (template) {
          if (!this.constructor._templateElement) {
            this.constructor._templateElement = document.createElement('template');
            this.constructor._templateElement.innerHTML = template;
          }
          this.attachShadow({mode: 'open'});
          const dom = document.importNode(
            this.constructor._templateElement.content, true);
          this.shadowRoot.appendChild(dom);
        }
      }
      super.connectedCallback();
    }
  }

export class XThumbs extends PartThemeElement {
    static get template() {
      return `
        <div part="thumb-up">👍</div>
        <div part="thumb-down">👎</div>
      `;
    }
  }

  customElements.define('x-thumbs', XThumbs);

export class XRating extends PartThemeElement {
    static get template() {
      return `
        <style>
          :host {
            display: inline-block;
          }
          x-thumbs::part(thumb-up) {
            border: 1px dotted green;
            padding: 4px;
            min-width: 20px;
            display: inline-block;
            background: blue;
          }
          x-thumbs::part(thumb-down) {
            border: 1px dotted red;
            padding: 4px;
            min-width: 20px;
            display: inline-block;
          }
        </style>
        <div part="subject"><slot></slot></div>
        <x-thumbs part="* => rating-*"></x-thumbs>
      `;
    }
  }
  customElements.define('x-rating', XRating);

export class XHost extends PartThemeElement {
    static get template() {
      return `
        <style>
          :host {
            display: block;
            border: 2px solid orange;
          }
          x-rating {
            margin: 4px;
          }
          x-rating::part(subject) {
            padding: 4px;
            min-width: 20px;
            display: inline-block;
          }
          x-rating {
            --e1-part-subject-padding: 4px;
          }
          .uno:hover::part(subject) {
            background: lightgreen;
          }
          .duo::part(subject) {
            background: goldenrod;
          }
          .uno::part(rating-thumb-up) {
            background: green;
          }
          .uno::part(rating-thumb-down) {
            background: tomato;
          }
          .duo::part(rating-thumb-up) {
            background: yellow;
          }
          .duo::part(rating-thumb-down) {
            background: black;
          }
          x-rating::theme(thumb-up) {
            border-radius: 8px;
          }

        </style>
        <x-rating class="uno">❤️</x-rating>
        <br>
        <x-rating class="duo">🤷</x-rating>
      `;
    }
  }
  customElements.define('x-host', XHost);