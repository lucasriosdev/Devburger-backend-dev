/** 
 * store -> Cadastrar / Adicionar
 * index -> Listar todos os registros
 * show -> Listar um registro
 * update -> Alterar um registro
 * delete -> Deletar um registro
 */

import { v4 } from 'uuid'
import * as Yup from 'yup'
import User from '../models/User'


class UserController {
    async store(req, res) {
        const schema = Yup.object({
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
            admin: Yup.boolean(),
        });

        try {
            schema.validateSync(req.body, { abortEarly: false });
        } catch(err) {
            return res.status(400).json({ error: err.errors });
        }

        const { name, email, password, admin } = req.body;

        const userExists = await User.findOne({
            where: {
                email,  
            },
        });

        /**
         * null, undefined, 0 -> false
         * true, 1, 'a', [], {} -> true
         */

        if (userExists) {
            return res.status(400).json({ error: 'User already exists.' });
        }

        const user = await User.create({
            id: v4(),
            name,
            email,
            password,
            admin,
        });
        return res.status(201).json({
            id:  user.id,
            name,
            email,
            admin,
        });
    }
}

export default new UserController();