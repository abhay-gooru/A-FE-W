import TaxonomyItem from 'gooru-web/models/taxonomy/taxonomy-item';
import BrowseItem from 'gooru-web/models/taxonomy/browse-item';

/**
 * Generates a taxonomy tree data structure for testing
 * @param {Number} levels - total number of parent/children levels in the tree
 * @param {TaxonomyItem} parent - parent item for all the items created in the current level
 * @param {Number} inc - number by which the number of items in each level will increase
 * @param {Number} currentLevel - current tree level being built (starts at 1)
 * @return {TaxonomyItem[][] ...} - the list of taxonomy items in the first level
 */
export function generateTaxonomyTestTree(levels = 1, parent = null, inc = 1, currentLevel = 1) {
  var totalItems = currentLevel * inc;
  var items = [];

  if (currentLevel <= levels) {

    for (let i = 0; i < totalItems; i++) {
      let parentId = (parent) ? parent.get('id') : '0';
      let parentIdNum = parentId.charAt(parentId.length - 1);

      let taxonomyItem = TaxonomyItem.create({
        id: '' + currentLevel + parentIdNum + i,
        label: 'Item : ' + currentLevel + ' : ' + parentIdNum + ' : ' + i,
        level: currentLevel,
        parent: parent
      });

      generateTaxonomyTestTree(levels, taxonomyItem, inc, currentLevel + 1);
      items.push(taxonomyItem);
    }

    if (parent) {
      // Link all items to parent
      parent.set('children', items);
    }

    return items;
  }
}

/**
 * Generates a tree data structure for testing the browse selector (@see gru-browse-selector)
 * @param {Number} levels - total number of parent/children levels in the tree
 * @param {Number} lastLevels - number of sub-levels in the last level of the tree
 * @param {Number} inc - number by which the number of items in each level will increase
 * @return {BrowseItem[][] ...} - the list of browse items in the first level
 */
export function generateBrowseTestTree(levels = 1, lastLevels = 0, inc = 1) {
  const startLevel = 1;
  var browseItems = [];

  var taxonomyItems = generateTaxonomyTestTree(levels + lastLevels, null, inc, startLevel);

  taxonomyItems.forEach(function(rootTaxonomyItem) {
    var item = BrowseItem.createFromTaxonomyItem(rootTaxonomyItem, levels + lastLevels);
    browseItems.push(item);
  });

  return browseItems;
}
