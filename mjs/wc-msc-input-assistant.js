import { _wcl } from './common-lib.js';
import { _wccss } from './common-css.js';
import {
  colorPalette as _fujiColorPalette,
  buttons as _fujiButtons,
  a11y as _fujiA11y,
  input as _fujiInput
} from './fuji-css.js';
import Mustache from './mustache.js';
import Dexie from './dexie.min.js';

const defaults = {
  forceupdate: false,
  module: 'assistant',
  options: [],
  l10n: {
    back: 'Back',
    search: 'search',
    submit: 'SUBMIT',
    inputLabel: 'Add option',
    inputPlaceholder: 'add option please'
  }
};

const booleanAttrs = ['forceupdate']; // booleanAttrs default should be false
const objectAttrs = ['options', 'l10n'];
const custumEvents = {
  pick: 'msc-input-assistant-pick',
  add: 'msc-input-assistant-add',
  delete: 'msc-input-assistant-delete'
};

const template = document.createElement('template');
template.innerHTML = `
<style>
${_wccss}
${_fujiColorPalette}
${_fujiButtons}
${_fujiA11y}
${_fujiInput}

:host{position:relative;inline-size:100%;display:block;}
.vanquish{display:none;}
.prevent-submit{display:none;}
.input-assistant {
  --module-background-color: var(--msc-input-assistant-module-background-color, rgba(255 255 255));
  --main-gap: .5em;
  --transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  --transition-duration: 350ms;
  --empty-text: var(--msc-input-assistant-no-result-content, 'Oops! nothing exist.');

  --theme-color: var(--msc-input-assistant-theme-color, rgba(230 50 89));
  --border-color: var(--msc-input-assistant-background-color, rgba(242 242 246));
  --border-size: .75em;
  --border-radius: .75em;
  --content-border-radius: calc(var(--border-radius) * .667);

  --input-block-size: 2.25em;
  --search-bgc: var(--msc-input-assistant-search-background-color, rgba(227, 227, 232));
  --mask-magnifier: path('m19.6 21-6.3-6.3q-.75.6-1.725.95Q10.6 16 9.5 16q-2.725 0-4.612-1.887Q3 12.225 3 9.5q0-2.725 1.888-4.613Q6.775 3 9.5 3t4.613 1.887Q16 6.775 16 9.5q0 1.1-.35 2.075-.35.975-.95 1.725l6.3 6.3ZM9.5 14q1.875 0 3.188-1.312Q14 11.375 14 9.5q0-1.875-1.312-3.188Q11.375 5 9.5 5 7.625 5 6.312 6.312 5 7.625 5 9.5q0 1.875 1.312 3.188Q7.625 14 9.5 14Z');
  --search-text-color: var(--msc-input-assistant-search-text-color, rgba(127 127 132));
  --search-placeholder-text-color: var(--msc-input-assistant-search-placeholder-text-color, rgba(127 127 132));

  --mask-trash-can: path('M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21ZM17 6H7v13h10ZM9 17h2V8H9Zm4 0h2V8h-2ZM7 6v13Z');
  --suggestion-unit-padding-inline: .75em;
  --suggestion-unit-size: 2.5em;
  --max-suggestion-unit-count: 5.65;
  --suggestion-max-block-size: calc(var(--max-suggestion-unit-count) * var(--suggestion-unit-size));
  --suggestion-unit-color: var(--msc-input-assistant-option-text-color, rgba(0 0 0));
  --suggestion-unit-line-size: calc(100% - (var(--suggestion-unit-padding-inline) * 2));
  --suggestion-unit-line-color: var(--msc-input-assistant-line-color, rgba(198 198 200));
  --mask-size: calc(var(--suggestion-unit-size) / 2);
  --suggestion-mask: linear-gradient(to bottom,transparent 0%,black calc(0% + var(--mask-size)),black calc(100% - var(--mask-size)),transparent 100%);

  --mask-add: path('M11 17h2v-4h4v-2h-4V7h-2v4H7v2h4Zm1 5q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Z');
  --mask-arrow-back: path('M16 22 6 12 16 2l1.775 1.775L9.55 12l8.225 8.225Z');
  --add-color: var(--theme-color);

  /* input */
  --default-background-color: var(--msc-input-assistant-input-background-color, rgba(255 255 255));
  --default-theme: var(--msc-input-assistant-input-theme-color, rgba(15 105 255));
  --default-label-text-color: var(--msc-input-assistant-input-label-color, rgba(110 119 128));
  --default-text-color: var(--msc-input-assistant-input-text-color, rgba(35 42 49));
  --default-placeholder-text-color: var(--msc-input-assistant-input-placeholder-text-color, rgba(70 78 86));

  --a11y-block-link-overlay-color: var(--msc-input-assistant-overlay, 29 34 40);
}

.input-assistant__content__add__buttons[data-type='primary'] {
  --default-background-color: var(--msc-input-assistant-submit-background-color, rgba(15 105 255));
  --color: var(--msc-input-assistant-submit-text-color, rgba(255 255 255));
}

.input-assistant__functions__add {
  --a11y-block-link-border-radius: var(--input-block-size);
}

.input-assistant__content__add__head {
  --a11y-block-link-border-radius: 8px;
}

.input-assistant__suggestion__unit{
  --a11y-block-link-border-radius: 4px;
}

.input-assistant__content {
  --suggestion-block-size: 161px;
  --add-block-size: 169px;
  --block-size: var(--suggestion-block-size);
}

.input-assistant__suggestion__unit__span {
  --line-clamp: 1;
}

.input-assistant__suggestion__unit__delete {
  --a11y-block-link-border-radius: 32px;
  --a11y-block-link-expand: 2px;
}

.input-assistant{padding:var(--border-size);background-color:var(--border-color);border-radius:var(--border-radius);box-sizing:border-box;outline:0 none;}
.input-assistant__content{inline-size:100%;block-size:var(--block-size);display:flex;flex-wrap:nowrap;overflow:hidden;align-items:flex-start;transition:block-size var(--transition-duration) var(--transition-timing-function);will-change:block-size;}
.input-assistant__content__unit{flex:0 0 100%;transition:transform var(--transition-duration) var(--transition-timing-function)}
.input-assistant__content__unit>*+*{margin-block-start:var(--main-gap);}
.input-assistant__content__unit--add{background-color:var(--border-color);pointer-events:none;}

.input-assistant__functions{display:flex;gap:.25em;align-items:center;}
.input-assistant__functions__add{flex:0 0 var(--input-block-size);aspect-ratio:1/1;color:transparent;overflow:hidden;}
.input-assistant__functions__add span{display:none;}
.input-assistant__functions__add::before{content:'';inline-size:1.5em;block-size:1.5em;background-color:var(--add-color);clip-path:var(--mask-add);}
.input-assistant__search{flex-grow:1;}
.input-assistant__functions__add.a11y-block-link{display:flex;}

.input-assistant--add .input-assistant__content{--block-size:var(--add-block-size);}
.input-assistant--add .input-assistant__content__unit--add{transform:translateX(-100%);pointer-events:auto;}

.input-assistant__label{background-color:var(--search-bgc);border-radius:var(--input-block-size);display:flex;align-items:center;padding-inline:.75em;gap:.5em;}
.input-assistant__label::before{inline-size:1.5em;block-size:1.5em;background-color:var(--search-text-color);content:'';clip-path:var(--mask-magnifier);display:block;}
.input-assistant__label__input{font-size:1em;color:var(--search-text-color);line-height:var(--input-block-size);block-size:var(--input-block-size);flex-grow:1;border-radius:0;border:0 none;background:transparent;outline:0 none;box-sizing:border-box;appearance:none;-webkit-appearance:none;}
.input-assistant__label__input::-webkit-input-placeholder{color:var(--search-placeholder-text-color);}
.input-assistant__label__input::-moz-placeholder{color:var(--search-placeholder-text-color);}

.input-assistant__suggestions__wrap{background-color:var(--module-background-color);border-radius:var(--content-border-radius);}
.input-assistant__suggestions{max-block-size:var(--suggestion-max-block-size);}
.input-assistant__suggestions{mask-image:var(--suggestion-mask);-webkit-mask-image:var(--suggestion-mask);}
.input-assistant__suggestions:empty::before{color:var(--theme-color);content:var(--empty-text);text-align:center;line-height:6;font-size:1.125em;mask-image:revert;-webkit-mask-image:revert;display:block;}

.input-assistant__suggestion__unit{position:relative;font-size:1em;color:var(--suggestion-unit-color);line-height:var(--suggestion-unit-size);block-size:var(--suggestion-unit-size);box-sizing:border-box;padding-inline:var(--suggestion-unit-padding-inline);display:block;outline:0 none;text-decoration:none;}
.input-assistant__suggestion__unit+.input-assistant__suggestion__unit::before{position:absolute;inset-inline-start:var(--suggestion-unit-padding-inline);inset-block-start:-.5px;inline-size:var(--suggestion-unit-line-size);block-size:1px;content:'';background-color:var(--suggestion-unit-line-color);}

.input-assistant__suggestion__unit{display:flex;align-items:center;justify-content:space-between;gap:.25em;}
.input-assistant__suggestion__unit__span{flex-grow:1;min-inline-size:0;}
.input-assistant__suggestion__unit__delete{font-size:16px;inline-size:2em;block-size:2em;flex-shrink:0;background:transparent;appearance:none;border:0 none;box-sizing:border-box;padding:0;margin:0;}
.input-assistant__suggestion__unit__delete::before{inline-size:1.5em;block-size:1.5em;content:'';background-color:var(--theme-color);clip-path:var(--mask-trash-can);}
.input-assistant__suggestion__unit__delete.a11y-block-link{display:flex;}

.input-assistant__suggestion__unit{transition:block-size 200ms var(--transition-timing-function);will-change:block-size;overflow:hidden;}
.input-assistant__suggestion__unit--remove{block-size:0px;}

.input-assistant__hr{margin-block-start:.5em;border:0 none;border-block-start:1px solid var(--suggestion-unit-line-color);}
.input-assistant__content__add__head{block-size:var(--input-block-size);display:flex;gap:.5em;align-items:center;outline:0 none;text-decoration:none;}
.input-assistant__content__add__head::before{inline-size:1.5em;block-size:1.5em;content:'';background-color:var(--add-color);clip-path:var(--mask-arrow-back);}
.input-assistant__content__add__head__span{font-size:1.125em;font-weight:500;color:var(--add-color);}
.input-assistant__content__add__buttons{inline-size:100%;margin-block-start:1.5em;}

.input-assistant__content--basis{}
</style>

<div class="main input-assistant" tabindex="0">
  <div class="input-assistant__content input-assistant__content--basis">
    <div class="input-assistant__content__unit">
      <div class="input-assistant__functions">
        <a href="#add" class="input-assistant__functions__add flex-center a11y-block-link esc-dark-mode" data-trigger="add" aria-label="add" title="add">
          <span>Add</span>
        </a>
        <form class="input-assistant__search">
          <label class="input-assistant__label">
            <input class="input-assistant__label__input" type="search" placeholder="${defaults.l10n.search}" autocomplete="off" autocapitalize="off" enterkeyhint="search" />
          </label>
          <input type="text" class="prevent-submit" name="prevent-submit">
        </form>
      </div>

      <hr class="input-assistant__hr" />

      <div class="input-assistant__suggestions__wrap">
        <div class="input-assistant__suggestions overscrolling"></div>
      </div>
    </div>

    <div class="input-assistant__content__unit input-assistant__content__unit--add">
      <a href="#back" class="input-assistant__content__add__head a11y-block-link esc-dark-mode" data-trigger="back" aria-label="back" title="back" tabindex="-1">
        <span class="input-assistant__content__add__head__span">${defaults.l10n.back}</span>
      </a>
      <hr class="input-assistant__hr">
      <form class="input-assistant__form">
        <div class="input-set esc-dark-mode">
          <input name="option" type="text" placeholder="${defaults.l10n.inputPlaceholder}" autocomplete="off" autocapitalize="off" enterkeyhint="done" tabindex="-1" />
          <label class="input-set__label">
            <span class="input-set__label__span">${defaults.l10n.inputLabel}</span>
          </label>
          <em class="input-set__em"></em>
        </div>
        <button
          class="buttons input-assistant__content__add__buttons"
          data-type="primary"
          data-size="large"
          tabindex="-1"
        >
          ${defaults.l10n.submit}
        </button>
      </form>
    </div>
  </div>
</div>
`;

const templateOption = document.createElement('template');
templateOption.innerHTML = `
  {{#data}}
  <a href="#option" class="input-assistant__suggestion__unit a11y-block-link esc-dark-mode">
    <span class="input-assistant__suggestion__unit__span line-clampin">{{option}}</span>
    {{#self}}
    <button type="button" class="input-assistant__suggestion__unit__delete flex-center a11y-block-link esc-dark-mode">
      <span class="vanquish">delete</span>
    </button>
    {{/self}}
  </a>
  {{/data}}
`;

// Houdini Props and Vals
if (CSS?.registerProperty) {
  try {
    CSS.registerProperty({
      name: '--msc-input-assistant-background-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(242 242 246)'
    });

    CSS.registerProperty({
      name: '--msc-input-assistant-module-background-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(255 255 255)'
    });

    CSS.registerProperty({
      name: '--msc-input-assistant-option-text-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(0 0 0)'
    });

    CSS.registerProperty({
      name: '--msc-input-assistant-theme-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(230 50 89)'
    });
    
    CSS.registerProperty({
      name: '--msc-input-assistant-line-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(198 198 200)'
    });

    CSS.registerProperty({
      name: '--msc-input-assistant-search-background-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(227, 227, 232)'
    });

    CSS.registerProperty({
      name: '--msc-input-assistant-search-text-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(127 127 132)'
    });
    
    CSS.registerProperty({
      name: '--msc-input-assistant-search-placeholder-text-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(127 127 132)'
    });
    
    CSS.registerProperty({
      name: '--msc-input-assistant-input-background-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(255 255 255)'
    });

    CSS.registerProperty({
      name: '--msc-input-assistant-input-theme-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(15 105 255)'
    });
    
    CSS.registerProperty({
      name: '--msc-input-assistant-input-label-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(110 119 128)'
    });

    CSS.registerProperty({
      name: '--msc-input-assistant-input-text-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(35 42 49)'
    });
    
    CSS.registerProperty({
      name: '--msc-input-assistant-input-placeholder-text-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(70 78 86)'
    });

    CSS.registerProperty({
      name: '--msc-input-assistant-submit-background-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(15 105 255)'
    });
    
    CSS.registerProperty({
      name: '--msc-input-assistant-submit-text-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(255 255 255)'
    });
  } catch(err) {
    console.warn(`msc-input-assistant: ${err.message}`);
  }
}

/*
 * indexedDB
 { module, option, self, mtime }
 */
const db = new Dexie('msc-input-assistant');
db.version(1).stores({
 options: '[module+option],module'
});

export class MscInputAssistant extends HTMLElement {
  #data;
  #nodes;
  #config;

  constructor(config) {
    super();

    // template
    this.attachShadow({ mode: 'open', delegatesFocus: true });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // data
    this.#data = {
      controller: '',
      iid: '',
      options: []
    };

    // nodes
    this.#nodes = {
      styleSheet: this.shadowRoot.querySelector('style'),
      main: this.shadowRoot.querySelector('.main'),
      options: this.shadowRoot.querySelector('.input-assistant__suggestions'),
      optionsWrap: this.shadowRoot.querySelector('.input-assistant__content__unit'),
      btnAdd: this.shadowRoot.querySelector('[data-trigger="add"]'),
      btnBack: this.shadowRoot.querySelector('[data-trigger="back"]'),
      search: this.shadowRoot.querySelector('.input-assistant__label__input'),
      form: this.shadowRoot.querySelector('.input-assistant__form'),
      input: this.shadowRoot.querySelector('[name="option"]')
    };

    // config
    this.#config = {
      ...defaults,
      ...config // new MscInputAssistant(config)
    };

    // evts
    this._onModeSwitch = this._onModeSwitch.bind(this);
    this._onInputDebounced = this._onInputDebounced.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onTransitionend = this._onTransitionend.bind(this);
  }

  async connectedCallback() {
   const { config, error } = await _wcl.getWCConfig(this);
   const { btnAdd, btnBack, search, form, options } = this.#nodes;

    if (error) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${error}`);
      this.remove();
      return;
    } else {
      this.#config = {
        ...this.#config,
        ...config
      };
    }

    // upgradeProperty
    Object.keys(defaults).forEach((key) => this.#upgradeProperty(key));

    // evts
    this.#data.controller = new AbortController();
    const signal = this.#data.controller.signal;
    btnAdd.addEventListener('click', this._onModeSwitch, { signal });
    btnBack.addEventListener('click', this._onModeSwitch, { signal });
    search.addEventListener('input', this._onInputDebounced, { signal });
    form.addEventListener('submit', this._onSubmit, { signal });
    options.addEventListener('click', this._onClick, { signal });
    options.addEventListener('transitionend', this._onTransitionend, { signal });
  }

  disconnectedCallback() {
    if (this.#data?.controller) {
      this.#data.controller.abort();
    }
  }

  #format(attrName, oldValue, newValue) {
    const hasValue = newValue !== null;

    if (!hasValue) {
      if (booleanAttrs.includes(attrName)) {
        this.#config[attrName] = false;
      } else {
        this.#config[attrName] = defaults[attrName];
      }
    } else {
      switch (attrName) {
        case 'forceupdate':
          this.#config[attrName] = true;
          break;


        case 'module':
          this.#config[attrName] = newValue || defaults.module;
          break;

        case 'options': {
          let values;
          try {
            values = JSON.parse(newValue);
          } catch(err) {
            console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${err.message}`);
            values = { ...defaults[attrName] };
          }
          this.#config[attrName] = Array.isArray(values) ? values : defaults.options;
          break;
        }

        case 'l10n': {
          let values;
          try {
            values = JSON.parse(newValue);
          } catch(err) {
            console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${err.message}`);
            values = { ...defaults[attrName] };
          }
          this.#config[attrName] = values;
          break;
        }
      }
    }
  }

  async attributeChangedCallback(attrName, oldValue, newValue) {
    if (!MscInputAssistant.observedAttributes.includes(attrName)) {
      return;
    }

    this.#format(attrName, oldValue, newValue);

    switch (attrName) {      
      case 'module':
        this.#render();
        break;

      case 'l10n': {
        const { btnBack, search:eleSearch, form, input } = this.#nodes;
        const {
          back,
          search,
          submit,
          inputLabel,
          inputPlaceholder
        } = {
          ...defaults.l10n,
          ...this.l10n
        };

        btnBack.querySelector('span').textContent = back;
        eleSearch.placeholder = search;
        form.querySelector('.buttons').textContent = submit;
        form.querySelector('.input-set__label__span').textContent = inputLabel;
        input.placeholder = inputPlaceholder;
        break;
      }

      case 'options': {
        const now = +new Date();
        const module = this.module;
        const options = this.options.reverse().map(
          (option, idx) => {
            return {
              module,
              option,
              self: false,
              mtime: now + idx
            };
          }
        );

        try {
          if (this.forceupdate) {
            await db.options
              .where('module').equals(this.module)
              .filter(({ self }) => !self)
              .delete();
          }

          await db.options.bulkPut(options);
        } catch(err) {
          console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${err.message}`);
        }

        this.#render();
        break;
      }
    }
  }

  static get observedAttributes() {
    return Object.keys(defaults); // MscInputAssistant.observedAttributes
  }

  #upgradeProperty(prop) {
    let value;

    if (MscInputAssistant.observedAttributes.includes(prop)) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        value = this[prop];
        delete this[prop];
      } else {
        if (booleanAttrs.includes(prop)) {
          value = (this.hasAttribute(prop) || this.#config[prop]) ? true : false;
        } else if (objectAttrs.includes(prop)) {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : JSON.stringify(this.#config[prop]);
        } else {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : this.#config[prop];
        }
      }

      this[prop] = value;
    }
  }

  set module(value) {
    if (value) {
      this.setAttribute('module', value);
    } else {
      this.removeAttribute('module');
    }
  }

  get module() {
    return this.#config.module;
  }

  set options(value) {
    if (value) {
      const newValue = [
        ...defaults.options,
        ...(typeof value === 'string' ? JSON.parse(value) : value)
      ];
      this.setAttribute('options', JSON.stringify(newValue));
    } else {
      this.removeAttribute('options');
    }
  }

  get options() {
    return this.#config.options;
  }

  set l10n(value) {
    if (value) {
      const newValue = {
        ...defaults.l10n,
        ...this.l10n,
        ...(typeof value === 'string' ? JSON.parse(value) : value)
      };
      this.setAttribute('l10n', JSON.stringify(newValue));
    } else {
      this.removeAttribute('l10n');
    }
  }

  get l10n() {
    return this.#config.l10n;
  }

  set forceupdate(value) {
    this.toggleAttribute('forceupdate', Boolean(value));
  }

  get forceupdate() {
    return this.#config.forceupdate;
  }

  get results() {
    return this.#data.options.reduce(
      (acc, { option }) => {
        return acc.concat(option);
      }
    , []);
  }

  async #render() {
    const { options, search } = this.#nodes;
    const q = search.value.trim();
    let data = [];

    options.replaceChildren();

    try {
      if (q.length) {
        // query with keyword
        const pattern = new RegExp(`.*${q}.*`, 'i');
        data = [].concat(
          await db.options
            .where('module').equals(this.module)
            .filter(({ option, self }) => pattern.test(option) && self)
            .reverse()
            .sortBy('mtime')
          ,
          await db.options
            .where('module').equals(this.module)
            .filter(({ option, self }) => pattern.test(option) && !self)
            .reverse()
            .sortBy('mtime')
        );
      } else {
        data = [].concat(
          await db.options
            .where('module').equals(this.module)
            .filter(({ self }) => self)
            .reverse()
            .sortBy('mtime')
          ,
          await db.options
            .where('module').equals(this.module)
            .filter(({ self }) => !self)
            .reverse()
            .sortBy('mtime')
        );
      }

      if (data.length) {
        options.replaceChildren();
        const templateString = Mustache.render(templateOption.innerHTML, { data });
        options.insertAdjacentHTML('afterbegin', templateString);
      }

      this.#data.options = data;
    } catch(err) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${err.message}`);
    }

    this.#refresh();
  }

  #refresh() {
    const { optionsWrap, styleSheet } = this.#nodes;
    const { height } = optionsWrap.getBoundingClientRect();

    _wcl.addStylesheetRules(
      '.input-assistant__content--basis',
      {
        '--suggestion-block-size': `${height}px`
      },
      styleSheet
    );
  }

  #fireEvent(evtName, detail) {
    this.dispatchEvent(new CustomEvent(evtName,
      {
        bubbles: true,
        composed: true,
        ...(detail && { detail })
      }
    ));
  }

  async clearStorage() {
    try {
      await db.options
        .where('module').equals(this.module)
        .delete();
    } catch(err) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${err.message}`);
    }
  }

  async query(keyword = '') {
    clearTimeout(this.#data.iid);
    this.#nodes.search.value = keyword.trim();
    await this.#render();

    return this.results;
  }

  async add(option = '') {
    option = option.trim();

    if (!option.length) {
      return;
    }

    try {
      await db.options.put({
        module: this.module,
        option,
        self: true,
        mtime: +new Date()
      });

      this.#render();
      this.#fireEvent(custumEvents.add, { option });
    } catch(err) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${err.message}`);
    }
  }

  _onModeSwitch(evt) {
    const target = evt.target.closest('a');

    evt.preventDefault();

    clearTimeout(this.#data.iid4Input);
    this.#nodes.main.classList.toggle('input-assistant--add', target.dataset.trigger === 'add');
  }

  async _onSubmit(evt) {
    const { input, search, btnBack } = this.#nodes;
    const option = input.value.trim();

    evt.preventDefault();

    if (!option.length) {
      return;
    }

    try {
      await db.options.put({
        module: this.module,
        option,
        self: true,
        mtime: +new Date()
      });

      input.value = '';
      search.value = '';
      this.#render();
      btnBack.click();

      this.#fireEvent(custumEvents.add, { option });
    } catch(err) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${err.message}`);
    }
  }

  async _onInputDebounced() {
    clearTimeout(this.#data.iid);

    this.#data.iid = setTimeout(
      () => {
        this.#render();
      }
    , 300);
  }

  async _onClick(evt) {
    evt.preventDefault();

    const host = evt.target.closest('a');
    const isButton = !!evt.target.closest('button');
    const option = host.querySelector('span').textContent.trim();

    if (isButton) {
      try {
        await db.options
          .where({ module:this.module, option })
          .delete();

        this.#fireEvent(custumEvents.delete, { option });
      } catch(err) {
        console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${err.message}`);
      }

      host.classList.add('input-assistant__suggestion__unit--remove');
    } else {
      this.#fireEvent(custumEvents.pick, { option });
    }
  }

  _onTransitionend(evt) {
    const { target, propertyName } = evt;
    const host = target.closest('a');

    if (host.classList.contains('input-assistant__suggestion__unit--remove') && ['height', 'block-size'].includes(propertyName)) {
      const { options } = this.#nodes;
      
      host.remove();

      if (!Array.from(options.querySelectorAll('a')).length) {
        options.replaceChildren();
      }

      this.#refresh();
    }
  }
}

// define web component
const S = _wcl.supports();
const T = _wcl.classToTagName('MscInputAssistant');
if (S.customElements && S.shadowDOM && S.template && !window.customElements.get(T)) {
  window.customElements.define(_wcl.classToTagName('MscInputAssistant'), MscInputAssistant);
}