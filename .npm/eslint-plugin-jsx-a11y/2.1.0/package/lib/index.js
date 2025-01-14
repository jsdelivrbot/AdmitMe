'use strict';

/* eslint-disable global-require */

module.exports = {
  rules: {
    'anchor-has-content': require('./rules/anchor-has-content'),
    'aria-props': require('./rules/aria-props'),
    'aria-proptypes': require('./rules/aria-proptypes'),
    'aria-role': require('./rules/aria-role'),
    'aria-unsupported-elements': require('./rules/aria-unsupported-elements'),
    'heading-has-content': require('./rules/heading-has-content'),
    'href-no-hash': require('./rules/href-no-hash'),
    'html-has-lang': require('./rules/html-has-lang'),
    'img-has-alt': require('./rules/img-has-alt'),
    'img-redundant-alt': require('./rules/img-redundant-alt'),
    'label-has-for': require('./rules/label-has-for'),
    lang: require('./rules/lang'),
    'mouse-events-have-key-events': require('./rules/mouse-events-have-key-events'),
    'no-access-key': require('./rules/no-access-key'),
    'no-marquee': require('./rules/no-marquee'),
    'no-onchange': require('./rules/no-onchange'),
    'onclick-has-focus': require('./rules/onclick-has-focus'),
    'onclick-has-role': require('./rules/onclick-has-role'),
    'role-has-required-aria-props': require('./rules/role-has-required-aria-props'),
    'role-supports-aria-props': require('./rules/role-supports-aria-props'),
    scope: require('./rules/scope'),
    'tabindex-no-positive': require('./rules/tabindex-no-positive')
  },
  configs: {
    recommended: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      rules: {
        'jsx-a11y/anchor-has-content': 2,
        'jsx-a11y/aria-props': 2,
        'jsx-a11y/aria-proptypes': 2,
        'jsx-a11y/aria-role': 2,
        'jsx-a11y/aria-unsupported-elements': 2,
        'jsx-a11y/heading-has-content': 2,
        'jsx-a11y/href-no-hash': 2,
        'jsx-a11y/html-has-lang': 2,
        'jsx-a11y/img-has-alt': 2,
        'jsx-a11y/img-redundant-alt': 2,
        'jsx-a11y/label-has-for': 2,
        'jsx-a11y/mouse-events-have-key-events': 2,
        'jsx-a11y/no-access-key': 2,
        'jsx-a11y/no-marquee': 2,
        'jsx-a11y/no-onchange': 2,
        'jsx-a11y/onclick-has-focus': 2,
        'jsx-a11y/onclick-has-role': 2,
        'jsx-a11y/role-has-required-aria-props': 2,
        'jsx-a11y/role-supports-aria-props': 2,
        'jsx-a11y/scope': 2,
        'jsx-a11y/tabindex-no-positive': 2
      }
    }
  }
};