import AppendElementTemplatesModule from './append-menu/index.js';
import CreateElementTemplatesModule from './create-menu/index.js';
import ReplaceElementTemplatesModule from './replace-menu/index.js';
import RemoveTemplatesModule from './remove-templates/index.js';

export default {
  __depends__: [
    AppendElementTemplatesModule,
    CreateElementTemplatesModule,
    ReplaceElementTemplatesModule,
    RemoveTemplatesModule
  ]
};