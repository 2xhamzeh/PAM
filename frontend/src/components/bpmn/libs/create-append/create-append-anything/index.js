import AppendMenuModule from './append-menu/index.js';
import CreateMenuModule from './create-menu/index.js';
import EditorActionsModule from './editor-actions/index.js';
import KeyboardBindingsModule from './keyboard-bindings/index.js';

export default {
  __depends__: [
    AppendMenuModule,
    CreateMenuModule,
    EditorActionsModule,
    KeyboardBindingsModule
  ],
};