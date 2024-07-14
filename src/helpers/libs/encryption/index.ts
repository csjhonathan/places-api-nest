import * as bcrypt from "bcrypt";

const PASSWORD_SHUFFLE = 10;

export class EncryptionHelper {
  static hashData(password: string) {
    return bcrypt.hashSync(password, PASSWORD_SHUFFLE);
  }

  static compareData({ signInPassword, userPassword }) {
    return bcrypt.compareSync(signInPassword, userPassword);
  }
}
