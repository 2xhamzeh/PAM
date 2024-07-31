import AppendMenuProvider from './AppendMenuProvider.js';
import AppendContextPadProvider from './AppendContextPadProvider.js';
import AppendRules from './AppendRules.js';

export default {
  __init__: [
    'appendMenuProvider',
    'appendContextPadProvider',
    'appendRules'
  ],
  appendMenuProvider: [ 'type', AppendMenuProvider ],
  appendContextPadProvider: [ 'type', AppendContextPadProvider ],
  appendRules: [ 'type', AppendRules ]
};
