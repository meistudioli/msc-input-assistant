# msc-input-assistant

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/msc-input-assistant) [![DeepScan grade](https://deepscan.io/api/teams/16372/projects/23758/branches/724986/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=16372&pid=23758&bid=724986)

&lt;msc-input-assistant /> is a web component which help user to input wisely. Users could search or pick option with list we provide. Once options are not good enough for them, they can 「add」 their own options for usage. &lt;msc-input-assistant /> will save options which user added in `indexedDB`. These options will be available in the same domain.

![<msc-input-assistant />](https://blog.lalacube.com/mei/img/preview/msc-input-assistant.png)

## Basic Usage

&lt;msc-input-assistant /> is a web component. All we need to do is put the required script into your HTML document. Then follow <msc-input-assistant />'s html structure and everything will be all set.

- Required Script

```html
<script
  type="module"
  src="https://your-domain/wc-msc-input-assistant.js">        
</script>
```

- Structure

Put &lt;msc-input-assistant /> into HTML document. It will have different functions and looks with attribute mutation.

```html
<msc-input-assistant>
  <script type="application/json">
    {
      "module": "assistant",
      "options": [
        "iPhone 12",
        "iPhone SE",
        "iPhone 13",
        "iPhone 14",
        "iPhone 14 Pro",
        "iPad mini",
        "iPad",
        "iPad Air",
        "iPad Pro"
      ],
      "l10n": {
        "back": "Back",
        "search": "search",
        "submit": "SUBMIT",
        "inputLabel": "Add option",
        "inputPlaceholder": "add option please"
      },
      "forceupdate": false
    }
  </script>
</msc-input-assistant>
```

Otherwise, developers could also choose remoteconfig to fetch config for &lt;msc-input-assistant />.

```html
<msc-input-assistant
  remoteconfig="https://your-domain/api-path"
>
</msc-input-assistant>
```

## JavaScript Instantiation

&lt;msc-input-assistant /> could also use JavaScript to create DOM element. Here comes some examples.

```html
<script type="module">
import { MscInputAssistant } from 'https://your-domain/wc-msc-input-assistant.js';

// use DOM api
const nodeA = document.createElement('msc-input-assistant');
document.body.appendChild(nodeA);
nodeA.forceupdate = true;
nodeA.options = [
  'iPhone',
  'iPad'
];

// new instance with Class
const nodeB = new MscInputAssistant();
document.body.appendChild(nodeB);
nodeB.options = [
  'Pixel 7 Pro',
  'Pixel 7',
];

// new instance with Class & default config
const config = {
  'module': 'assistant',
  'options': [
    'iPhone 12',
    'iPhone SE',
    'iPhone 13',
    'iPhone 14',
    'iPhone 14 Pro',
    'iPad mini',
    'iPad',
    'iPad Air',
    'iPad Pro'
  ],
  'l10n': {
    'back': 'Back',
    'search': 'search',
    'submit': 'SUBMIT',
    'inputLabel': 'Add option',
    'inputPlaceholder': 'add option please'
  },
  'forceupdate': false
};
const nodeC = new MscInputAssistant(config);
document.body.appendChild(nodeC);
</script>
```

## Style Customization

Developers could apply styles to decorate &lt;msc-input-assistant />'s looking.

```html
<style>
msc-input-assistant {
  --msc-input-assistant-background-color: rgba(242 242 246);
  --msc-input-assistant-module-background-color: rgba(255 255 255);
  --msc-input-assistant-option-text-color: rgba(0 0 0);
  --msc-input-assistant-theme-color: rgba(230 50 89);
  --msc-input-assistant-line-color: rgba(198 198 200);

  /* search */
  --msc-input-assistant-search-background-color: rgba(227, 227, 232);
  --msc-input-assistant-search-text-color: rgba(127 127 132);
  --msc-input-assistant-search-placeholder-text-color: rgba(127 127 132);

  /* submit */
  --msc-input-assistant-input-background-color: rgba(255 255 255);
  --msc-input-assistant-input-theme-color: rgba(15 105 255);
  --msc-input-assistant-input-label-color: rgba(110 119 128);
  --msc-input-assistant-input-text-color: rgba(35 42 49);
  --msc-input-assistant-input-placeholder-text-color: rgba(70 78 86);

  --msc-input-assistant-submit-background-color: rgba(15 105 255);
  --msc-input-assistant-submit-text-color: rgba(255 255 255);

  --msc-input-assistant-no-result-content: 'Oops! nothing exist.';

  --msc-input-assistant-overlay: 29 34 40;
}
</style>
```

## Attributes

&lt;msc-input-assistant /> supports some attributes to let it become more convenience & useful.

- **module**

Set module for &lt;msc-input-assistant />. <msc-input-assistant /> will apply this valus as key for data storage (indexedDB). Default is `assistant` (not set).

```html
<msc-input-assistant
  module="assistant"
>
  ...
</msc-input-assistant>
```

- **options**

Set options for &lt;msc-input-assistant />. It should be JSON string. Developers could set defalt options. Default is `[]` (not set).

```html
<msc-input-assittant
  options='["iPhone","iPad"]'
>
  ...
</msc-input-assittant>
```

- **forceupdate**

Set forceupdate for ^lt;msc-input-assistant />. It will decide append data or just remain current options' data. Default is `false` (not set).

```html
<msc-input-assittant
  forceupdate
>
  ...
</msc-input-assittant>
```

- **l10n**

Set localization for &lt;msc-input-assittant />. It will replace some message & button text to anything you like. It should be JSON string. Developers could set `back`、`search`、`submit`、`inputLabel` and `inputPlaceholder`.

  - `back`：back to pick mode text. Default is `Back`.
  - `search`：search field's placeholder. Default is `search`.
  - `submit`：button 「SUBMIT」text. Default is `SUBMIT`.
  - `inputLabel`：Add Mode > input field's label. Default is `Add option`.
  - `inputPlaceholder`：Add Mode > input field's placeholder. Default is `add option please`.

```html
<msc-input-assistant
  l10n='{"back":"Back","search":"search","submit":"SUBMIT","inputLabel":"Add option","inputPlaceholder":"add option please"}'
>
  ...
</msc-input-assistant>
```

## Properties

| Property Name | Type | Description |
| ----------- | ----------- | ----------- |
| module | String | Getter / Setter for current storage key. Default is `assistant` (not set). |
| options | Array | Getter / Setter for options. Default is `[]` (not set). |
| forceupdate | Boolean | Getter / Setter for data writing mode. It will decide append data or just remain current options' data. Default is `false` (not set). |
| l10n | Object | Getter / Setter for l10n. It will replace some message & button text to anything you like. Developers could set `back`、`search`、`submit`、`inputLabel` and `inputPlaceholder`. |
| results | Array | Getter for current display options. |

## Method

| Method Signature | Description |
| ----------- | ----------- |
| clearStorage | Clear current storage data (by current `module`). This is an async method. |
| query(keyword) | Query options by keyword and return results. This is an async method and makes UI mutated. |


## Event

| Event Signature | Description |
| ----------- | ----------- |
| msc-input-assistant-pick | Fired when option picked. |
| msc-input-assistant-add | Fired when option added. |
| msc-input-assistant-delete | Fired when option deleted. |

## Reference
- [WEBCOMPONENTS.ORG](https://www.webcomponents.org/element/msc-input-assistant)
