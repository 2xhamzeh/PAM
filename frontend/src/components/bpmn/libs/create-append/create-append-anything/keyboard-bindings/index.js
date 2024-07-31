import AppendMenuModule from '../append-menu/index.js';
import CreateMenuModule from '../create-menu/index.js';

import CreateAppendKeyboardBindings from './KeyboardBindings.js';

export default {
  __depends__: [
    AppendMenuModule,
    CreateMenuModule
  ],
  __init__: [
    'createAppendKeyboardBindings'
  ],
  createAppendKeyboardBindings: [ 'type', CreateAppendKeyboardBindings ]
};