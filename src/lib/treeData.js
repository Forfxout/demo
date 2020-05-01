import _ from 'lodash';


export function createTree(rows) {
    const items = {};
    const output = [];

    rows.forEach((row) => {
        items[row.id] = { ...row, children: [] };
    });

    rows.forEach((row) => {
        if (row.parent_id === null) {
            output.push(row);
        } else {
            items[row.parent_id].children.push(row);
        }
    });

    return output;
}


export function cutTree(rows, level = 1) {
    return rows.map((item) => {
        const newItem = _.omit(item, ['children']);
        newItem.children = [];

        if (level > 1) {
            newItem.children = cutTree(item.children, level - 1);
        }

        return newItem;
    });
}


export function findItemById(rows, id) {
    const foundItem = _.find(rows, item => item.id === id);
    if (foundItem) {
        return foundItem;
    }
    const childs = _.flatten(rows.map(item => item.children));
    return findItemById(childs, id);
}
