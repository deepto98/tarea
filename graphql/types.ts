import { objectType, extendType, stringArg, nonNull, intArg, enumType } from 'nexus'

//These are Nexus types, which Nexus uses to auto generate the GraphQL schema

// --------TASK TYPES------------

export const Task = objectType({
    name: 'Task',
    definition(t) {
        t.string('id')
        t.string('createdAt')
        t.string('title')
        t.string('description')
        t.string('status')
        t.string('userId')
        t.field('user', {
            type: User,
            async resolve(parent, _args, ctx) {
                return await ctx.prisma.task
                    .findUnique({
                        where: {
                            id: parent.id,
                        },
                    })
                    .users()
            },
        })
    },
})

export const TasksQuery = extendType({
    type: 'Query',
    definition(t) {
        // get all tasks
        t.nonNull.list.field('tasks', {
            type: 'Task',
            resolve(_parent, _args, ctx) {
                return ctx.prisma.task.findMany()
            },
        });
        // get task by user id
        t.field('task', {
            type: 'Task',
            args: {
                userId: nonNull(stringArg())
            },
            resolve(_parent, args, ctx) {
                return ctx.prisma.task.findMany({
                    where: {
                        userId: args.userId
                    }
                })
            },
        })
    },
})

export const TaskMutation = extendType({
    type: 'Mutation',
    definition(t) {
        // create a new task
        t.nonNull.field('createTask', {
            type: 'Task',
            args: {
                title: nonNull(stringArg()),
                description: nonNull(stringArg()),
                userId: stringArg(),
                id: stringArg(),
                status: stringArg(),
            },
            resolve(_root, args, ctx) {
                return ctx.prisma.task.create({
                    data: {
                        title: args.title,
                        description: args.description,
                        userId: args.userId,
                        id: args.id,
                        status: args.status,
                    }
                })
            },
        });
        // update a task by id
        t.field('updateTask', {
            type: 'Task',
            args: {
                id: nonNull(stringArg()),
                title: stringArg(),
                description: stringArg(),
                userId: stringArg(),
                status: stringArg(),
            },
            resolve(_root, args, ctx) {
                return ctx.prisma.task.update({
                    where: { id: args.id },
                    data: {
                        title: args.title,
                        description: args.description,
                        userId: args.userId,
                        status: args.status,
                    },
                });
            },
        });
        // delete a task by id
        t.field('deleteTask', {
            type: 'Task',
            args: {
                id: nonNull(stringArg()),
            },
            resolve(_root, args, ctx) {
                return ctx.prisma.task.delete({
                    where: { id: args.id },
                });
            },
        });
    },
});

// --------USER TYPES------------

export const User = objectType({
    name: 'User',
    definition(t) {
        t.string('id')
        t.string('name')
        t.string('email')
        t.string('image')
        t.field('role', { type: Role })
        t.list.field('tasks', {
            type: Task,
            async resolve(parent, _args, ctx) {
                return await ctx.prisma.user
                    .findUnique({
                        where: {
                            id: parent.id,
                        },
                    })
                    .tasks()
            },
        })
    },
})

export const UsersQuery = extendType({
    type: 'Query',
    definition(t) {
        // get all users
        t.nonNull.list.field('users', {
            type: 'User',
            resolve(_parent, _args, ctx) {
                return ctx.prisma.user.findMany()
            },
        });

        // get user by id
        t.field('user', {
            type: 'User',
            args: {
                id: nonNull(stringArg()),
            },
            resolve(_parent, args, ctx) {
                return ctx.prisma.user.findUnique({
                    where: { id: args.id },
                });
            },
        });

        // get user by email
        t.field('user', {
            type: 'User',
            args: {
                email: nonNull(stringArg())
            },
            resolve(_parent, args, ctx) {
                return ctx.prisma.user.findUnique({
                    where: { email: args.email },
                });
            },
        });
    },
})

// --------ROLE TYPES------------

const Role = enumType({
    name: 'Role',
    members: ['FREE', 'SUBSCRIBED'],
})