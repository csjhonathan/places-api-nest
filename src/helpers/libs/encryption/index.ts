import * as bcrypt from "bcrypt";

const PASSWORD_SHUFFLE = 10;

interface IHashDataParams {
  raw_data: string;
}

interface ICompareDataParams {
  raw_data: string;
  encrypted_data: string;
}

export class EncryptionHelper {
  static hashData({ raw_data }: IHashDataParams) {
    return bcrypt.hashSync(raw_data, PASSWORD_SHUFFLE);
  }

  static compareData({ raw_data, encrypted_data }: ICompareDataParams) {
    return bcrypt.compareSync(raw_data, encrypted_data);
  }
}
