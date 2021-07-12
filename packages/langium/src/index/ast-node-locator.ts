/******************************************************************************
 * Copyright 2021 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { LangiumDocument } from '../documents/document';
import { findAssignment, isArray } from '../grammar/grammar-util';
import { AstNode } from '../syntax-tree';

export interface AstNodePathComputer {
    astNodePath(node: AstNode): string;
}

export interface AstNodeLocator {
    astNode(document: LangiumDocument, path: string): AstNode;
}
export class DefaultAstNodeLocator implements AstNodeLocator, AstNodePathComputer {
    protected segmentSeparator = '/';

    astNodePath(node: AstNode): string {
        let container: AstNode | undefined = node.$container;
        const path: string[] = [''];
        while (container) {
            path.push(this.pathSegment(node, container));
            node = container;
            container = container.$container;
        }
        return path.join(this.segmentSeparator);
    }

    astNode(document: LangiumDocument, path: string): AstNode {
        //const segments = path.split(this.segmentSeparator);
        return undefined!;
    }

    protected pathSegment(node: AstNode, container: AstNode): string {
        if (node.$cstNode) {
            const assignment = findAssignment(node.$cstNode);
            if (assignment) {
                if (isArray(assignment.cardinality)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const value = (container as any)[assignment.feature] as AstNode[];
                    const idx = value.indexOf(node);
                    return assignment.feature + '@' + idx;
                }
                return assignment.feature;
            }
        }
        return '<missing>';
    }
}

