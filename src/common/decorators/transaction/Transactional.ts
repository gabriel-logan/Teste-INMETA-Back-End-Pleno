import { Logger } from "@nestjs/common";
import { MongooseProvider } from "src/configs/mongoose-provider";

type DesctriptorType = TypedPropertyDescriptor<
  (...args: any[]) => Promise<any>
>;

const logger = new Logger("Transaction");

export function Transactional() {
  return (
    _target: any,
    _methodName: string,
    desctriptor: DesctriptorType,
  ): DesctriptorType => {
    const originalMethod = desctriptor.value;

    if (!originalMethod) {
      throw new Error(
        "Transactional decorator can only be applied to methods.",
      );
    }

    desctriptor.value = async function (...args: unknown[]): Promise<unknown> {
      const connection = MongooseProvider.getMongooseInstance(
        `Mongoose instance is not available in the context of this method. Method: ${_methodName}.`,
      );

      logger.debug(`Starting transaction for method: ${_methodName}.`);

      const result = await connection
        .transaction(async (session) => {
          const result = (await originalMethod.apply(this, [
            ...args,
            session, // Pass the session to the original method IF needed
          ])) as Promise<unknown>;

          return result;
        })
        .catch((error) => {
          logger.error(
            `Transaction failed for method: ${_methodName}. Rolling back. \n`,
          );
          throw error;
        });

      logger.debug(
        `Transaction successfully completed for method: ${_methodName}. \n`,
      );

      return result;
    };

    return desctriptor;
  };
}
