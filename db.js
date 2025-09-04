const { PrismaClient } = require('@prisma/client');
const { DateTime } = require('luxon');
const chalk = require('chalk');
const prisma = new PrismaClient();

// --- SESSION FUNCTIONS --- //
async function getSession(id, messages = true) {
    try {
        const data = await prisma.session.findUnique({
            where: { id },
            include: messages ? { messages: true } : undefined
        });

        if(data && data.expiresAt < DateTime.utc().toJSDate()) {
            await prisma.session.delete({
                where: { id }
            });

            return null;
        }

        return data;
    } catch (error) {
        return null;
    }
}

async function createSession(data) {
    try {
        return await prisma.session.create({ data });
    } catch (error) {
        return null;
    }
}

async function revokeSession(id) {
    try {
        // Delete all messages for the session
        await prisma.message.deleteMany({
            where: { sessionId: id }
        });

        // Delete the session itself
        const data = await prisma.session.delete({
            where: { id }
        });

        if(data && data.expiresAt < DateTime.utc().toJSDate()) {
            return null;
        }

        return data;
    } catch (error) {
        return null;
    }
}

async function expireSessions() {
    try {
        return await prisma.session.deleteMany({
            where: {
                expiresAt: { lt: DateTime.utc().toJSDate() }
            }
        });
    } catch (error) {
        return null;
    }
}

// --- MESSAGE FUNCTIONS --- //
async function addMessage(sessionId, data) {
    try {
        return await prisma.message.create({
            data: {
                sessionId,
                from: data.from,
                subject: data.subject,
                body: data.body,
                html: data.html ?? null,
                receivedAt: new Date(data.receivedAt) ?? DateTime.utc().toJSDate()
            }
        });
    } catch (error) {
        console.error(chalk.red('[DATABASE]'), 'Failed to add message:', error);
        return null;
    }
}

async function deleteMessage(id) {
    try {
        return await prisma.message.delete({ where: { id } });
    } catch (error) {
        return null;
    }
}

console.log(`${chalk.blue('[DATABASE]')} Database connections established successfully.`);
process.on('SIGINT', async () => {
    try {
        // quick little fix to make sure it saves before exiting
        await prisma.$disconnect();
        
        process.exit(0);
    } catch (err) {
        console.error('Error disconnecting Prisma:', err);
        process.exit(1);
    }
});

module.exports = { getSession, createSession, revokeSession, expireSessions, addMessage, deleteMessage };