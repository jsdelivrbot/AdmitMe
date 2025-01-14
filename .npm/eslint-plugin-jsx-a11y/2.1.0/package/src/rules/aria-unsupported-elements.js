/**
 * @fileoverview Enforce that elements that do not support ARIA roles,
 *  states and properties do not have those attributes.
 * @author Ethan Cohen
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import DOM from '../util/attributes/DOM';
import ARIA from '../util/attributes/ARIA';
import { elementType, propName } from 'jsx-ast-utils';

const errorMessage = invalidProp =>
  `This element does not support ARIA roles, states and properties. \
Try removing the prop '${invalidProp}'.`;

module.exports = {
  meta: {
    docs: {},

    schema: [
      { type: 'object' },
    ],
  },

  create: context => ({
    JSXOpeningElement: node => {
      const nodeType = elementType(node);
      const nodeAttrs = DOM[nodeType];
      const isReservedNodeType = nodeAttrs && nodeAttrs.reserved || false;

      // If it's not reserved, then it can have ARIA-* roles, states, and properties
      if (isReservedNodeType === false) {
        return;
      }

      const invalidAttributes = Object.keys(ARIA).concat('ROLE');

      node.attributes.forEach(prop => {
        if (prop.type === 'JSXSpreadAttribute') {
          return;
        }

        const name = propName(prop);
        const normalizedName = name ? name.toUpperCase() : '';

        if (invalidAttributes.indexOf(normalizedName) > -1) {
          context.report({
            node,
            message: errorMessage(name),
          });
        }
      });
    },
  }),
};
