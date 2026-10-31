import express from 'express';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { demoUsers } from './db/schema';

const app = express();
const PORT = 8000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, welcome to the Classroom API!');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

async function main() {
  const email = `admin-${Date.now()}@example.com`;

  try {
    const [newUser] = await db
      .insert(demoUsers)
      .values({ name: 'Admin User', email })
      .returning();

    if (!newUser) throw new Error('Failed to create user');
    console.log('CREATE:', newUser);

    const [foundUser] = await db
      .select()
      .from(demoUsers)
      .where(eq(demoUsers.id, newUser.id));
    console.log('READ:', foundUser);

    const [updatedUser] = await db
      .update(demoUsers)
      .set({ name: 'Super Admin' })
      .where(eq(demoUsers.id, newUser.id))
      .returning();

    if (!updatedUser) throw new Error('Failed to update user');
    console.log('UPDATE:', updatedUser);

    await db.delete(demoUsers).where(eq(demoUsers.id, newUser.id));
    console.log('DELETE: User deleted');
  } catch (error) {
    console.error('CRUD operation failed:', error);
    process.exitCode = 1;
  }
}

main();