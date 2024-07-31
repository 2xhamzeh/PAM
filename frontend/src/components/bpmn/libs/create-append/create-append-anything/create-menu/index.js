import CreateMenuProvider from './CreateMenuProvider.js';
import CreatePaletteProvider from './CreatePaletteProvider.js';

export default {
  __init__: [
    'createMenuProvider',
    'createPaletteProvider'
  ],
  createMenuProvider: [ 'type', CreateMenuProvider ],
  createPaletteProvider: [ 'type', CreatePaletteProvider ]
};
