import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    // Função chamada para gerar um hash antes de salvar o usuário
    this.addHook('beforeSave', async user => {
      // Gerando hash para novo usuário
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  // Criando relacionamento usuário com avatar
  static associate(models) {
    // belongsTo (pertence a -> tipo de relacionamento)
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(pasword) {
    return bcrypt.compare(pasword, this.password_hash);
  }
}

export default User;
