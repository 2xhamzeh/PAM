import AppendMenuModule from '../append-menu/index.js';
import CreateMenuModule from '../create-menu/index.js';

import CreateAppendEditorActions from './EditorActions.js';

export default {
  __depends__: [
    AppendMenuModule,
    CreateMenuModule
  ],
  __init__: [
    'createAppendEditorActions'
  ],
  createAppendEditorActions: [ 'type', CreateAppendEditorActions ]
};