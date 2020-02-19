import { Router } from 'express';
import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Luciano Liboni',
    email: 'luciano@email.com',
    password_hash: '12343654',
  });

  return res.json(user);
});
export default routes;
