import { faker } from "@faker-js/faker";
import { generateCpf } from "cpf_and_cnpj-generator";

export function createFakeEmployee(): {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  cpf: string;
} {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    username: faker.internet.username(),
    password: faker.internet.password(),
    cpf: generateCpf(),
  };
}
