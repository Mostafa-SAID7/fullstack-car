import { Injectable } from '@angular/core';
import { TreeNode } from '../models/base.models';

/**
 * Service for transforming and manipulating data structures
 */
@Injectable({
    providedIn: 'root'
})
export class DataTransformerService {

    /**
     * Convert flat array to hierarchical tree structure
     * @param items Flat array of items
     * @param idField Field name for item ID
     * @param parentIdField Field name for parent ID
     * @param childrenField Field name for children array
     * @param maxDepth Maximum depth to prevent infinite loops
     */
    parseHierarchical<T extends object>(
        items: T[],
        idField: keyof T = 'id' as keyof T,
        parentIdField: keyof T = 'parentId' as keyof T,
        childrenField: string = 'children',
        maxDepth: number = 50
    ): T[] {
        if (!items || items.length === 0) return [];

        const itemMap = new Map<any, T & { children?: T[] }>();
        const rootItems: T[] = [];

        // Create map of all items
        items.forEach(item => {
            itemMap.set(item[idField], { ...item, [childrenField]: [] });
        });

        // Build hierarchy
        items.forEach(item => {
            const parentId = item[parentIdField];
            const currentItem = itemMap.get(item[idField])!;

            if (parentId === null || parentId === undefined) {
                rootItems.push(currentItem);
            } else {
                const parent = itemMap.get(parentId);
                if (parent) {
                    const children = (parent as any)[childrenField] || [];
                    children.push(currentItem);
                    (parent as any)[childrenField] = children;
                } else {
                    // Parent not found, treat as root
                    rootItems.push(currentItem);
                }
            }
        });

        return rootItems;
    }

    /**
     * Convert hierarchical tree to flat array
     * @param items Hierarchical array
     * @param childrenField Field name for children
     */
    flattenHierarchy<T extends object>(items: T[], childrenField: string = 'children'): T[] {
        const result: T[] = [];

        const flatten = (item: T) => {
            const { [childrenField]: children, ...rest } = item as any;
            result.push(rest as T);

            if (children && Array.isArray(children)) {
                children.forEach(child => flatten(child));
            }
        };

        items.forEach(item => flatten(item));
        return result;
    }

    /**
     * Convert array to tree nodes with depth tracking
     */
    toTreeNodes<T extends object>(
        items: T[],
        idField: keyof T = 'id' as keyof T,
        parentIdField: keyof T = 'parentId' as keyof T
    ): TreeNode<T>[] {
        const hierarchical = this.parseHierarchical(items, idField, parentIdField);

        const convertToNode = (item: any, depth: number = 0, parent?: TreeNode<T>): TreeNode<T> => {
            const node: TreeNode<T> = {
                data: item,
                depth,
                parent,
                isExpanded: depth < 2 // Auto-expand first 2 levels
            };

            if (item.children && Array.isArray(item.children)) {
                node.children = item.children.map((child: any) => convertToNode(child, depth + 1, node));
            }

            return node;
        };

        return hierarchical.map(item => convertToNode(item));
    }

    /**
     * Group array by field
     */
    groupBy<T>(items: T[], field: keyof T): Map<any, T[]> {
        const groups = new Map<any, T[]>();

        items.forEach(item => {
            const key = item[field];
            const group = groups.get(key) || [];
            group.push(item);
            groups.set(key, group);
        });

        return groups;
    }

    /**
     * Group array by multiple fields
     */
    groupByMultiple<T>(items: T[], fields: (keyof T)[]): Map<string, T[]> {
        const groups = new Map<string, T[]>();

        items.forEach(item => {
            const key = fields.map(field => String(item[field])).join('|');
            const group = groups.get(key) || [];
            group.push(item);
            groups.set(key, group);
        });

        return groups;
    }

    /**
     * Sort array by field
     */
    sortBy<T>(items: T[], field: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
        return [...items].sort((a, b) => {
            const aVal = a[field];
            const bVal = b[field];

            if (aVal === bVal) return 0;

            let comparison = 0;
            if (aVal > bVal) comparison = 1;
            if (aVal < bVal) comparison = -1;

            return direction === 'asc' ? comparison : -comparison;
        });
    }

    /**
     * Sort by multiple fields
     */
    sortByMultiple<T>(items: T[], sorts: Array<{ field: keyof T; direction: 'asc' | 'desc' }>): T[] {
        return [...items].sort((a, b) => {
            for (const sort of sorts) {
                const aVal = a[sort.field];
                const bVal = b[sort.field];

                if (aVal !== bVal) {
                    let comparison = 0;
                    if (aVal > bVal) comparison = 1;
                    if (aVal < bVal) comparison = -1;
                    return sort.direction === 'asc' ? comparison : -comparison;
                }
            }
            return 0;
        });
    }

    /**
     * Filter array by predicate
     */
    filterBy<T>(items: T[], predicate: (item: T) => boolean): T[] {
        return items.filter(predicate);
    }

    /**
     * Paginate array
     */
    paginate<T>(items: T[], page: number, pageSize: number): T[] {
        const startIndex = (page - 1) * pageSize;
        return items.slice(startIndex, startIndex + pageSize);
    }

    /**
     * Get unique values from array by field
     */
    unique<T>(items: T[], field: keyof T): any[] {
        return [...new Set(items.map(item => item[field]))];
    }

    /**
     * Count items by field value
     */
    countBy<T>(items: T[], field: keyof T): Map<any, number> {
        const counts = new Map<any, number>();

        items.forEach(item => {
            const key = item[field];
            counts.set(key, (counts.get(key) || 0) + 1);
        });

        return counts;
    }

    /**
     * Deep clone object
     */
    deepClone<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Deep merge objects deeply
     */
    deepMerge<T extends object>(target: T, ...sources: Partial<T>[]): T {
        if (!sources.length) return target;

        const source = sources.shift();
        if (!source) return target;

        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                const sourceValue = (source as any)[key];
                if (this.isObject(sourceValue)) {
                    if (!(target as any)[key]) {
                        Object.assign(target as any, { [key]: {} });
                    }
                    this.deepMerge((target as any)[key], sourceValue);
                } else {
                    Object.assign(target as any, { [key]: sourceValue });
                }
            });
        }

        return this.deepMerge(target, ...sources);
    }

    /**
     * Pick specific fields from object
     */
    pick<T extends object, K extends keyof T>(obj: T, fields: K[]): Pick<T, K> {
        const result = {} as Pick<T, K>;
        fields.forEach(field => {
            if (field in obj) {
                result[field] = obj[field];
            }
        });
        return result;
    }

    /**
     * Omit specific fields from object
     */
    omit<T extends object, K extends keyof T>(obj: T, fields: K[]): Omit<T, K> {
        const result = { ...obj };
        fields.forEach(field => {
            delete result[field];
        });
        return result;
    }

    /**
     * Calculate tree depth
     */
    calculateDepth<T>(node: TreeNode<T>): number {
        if (!node.children || node.children.length === 0) {
            return 1;
        }
        return 1 + Math.max(...node.children.map((child: TreeNode<T>) => this.calculateDepth(child)));
    }

    /**
     * Flatten tree to array with depth info
     */
    flattenTree<T>(nodes: TreeNode<T>[]): Array<TreeNode<T> & { depth: number }> {
        const result: Array<TreeNode<T> & { depth: number }> = [];

        const traverse = (node: TreeNode<T>, depth: number = 0) => {
            result.push({ ...node, depth });
            if (node.children) {
                node.children.forEach((child: TreeNode<T>) => traverse(child, depth + 1));
            }
        };

        nodes.forEach(node => traverse(node));
        return result;
    }

    private isObject(item: any): boolean {
        return item && typeof item === 'object' && !Array.isArray(item);
    }
}
