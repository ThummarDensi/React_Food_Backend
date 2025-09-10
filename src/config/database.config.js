import { connect, set } from 'mongoose';
import { UserModel } from '../models/user.model.js';
import { FoodModel } from '../models/food.model.js';
import { sample_users } from '../../data.js';
import { sample_foods } from '../../data.js';
import bcrypt from 'bcryptjs';

const PASSWORD_HASH_SALT_ROUNDS = 10;
set('strictQuery', true);

export const dbconnect = async () => {
  try {
    await connect(process.env.MONGO_URI); // Remove useNewUrlParser and useUnifiedTopology
    await seedUsers();
    await seedFoods();
    console.log('MongoDB connected successfully---');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

async function seedUsers() {
  const usersCount = await UserModel.countDocuments();
  if (usersCount > 0) {
    console.log('Users seed is already done!');
    return;
  }
  if (!sample_users || !sample_users.length) throw new Error('sample_users is empty or undefined');
  for (let user of sample_users) {
    user.password = await bcrypt.hash(user.password, PASSWORD_HASH_SALT_ROUNDS);
    await UserModel.create(user);
  }
  console.log('Users seed is done!');
}

async function seedFoods() {
  const foodsCount = await FoodModel.countDocuments();
  if (foodsCount > 0) {
    console.log('Foods seed is already done!');
    return;
  }
  if (!sample_foods || !sample_foods.length) throw new Error('sample_foods is empty or undefined');
  for (const food of sample_foods) {
    food.imageUrl = `/foods/${food.imageUrl}`;
    await FoodModel.create(food);
  }
  console.log('Foods seed is done!');
}