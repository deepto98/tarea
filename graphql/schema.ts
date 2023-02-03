import { connectionPlugin, makeSchema } from "nexus";
import *  as types from './types';
import { join } from "path";

export const schema = makeSchema({
    plugins: [connectionPlugin()],
    types,
    outputs: {
        typegen: join(process.cwd(), 'generated/nexus-typegen.ts'),
        schema: join(process.cwd(), 'generated/schema.graphql')
    },
    contextType: {
        export: 'Context',
        module: join(process.cwd(), 'graphql', 'context.ts'),
    },
});