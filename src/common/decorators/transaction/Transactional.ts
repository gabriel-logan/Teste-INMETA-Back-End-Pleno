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

      const session = await connection.startSession();

      session.startTransaction();

      try {
        logger.debug(`Starting transaction for method: ${_methodName}.`);

        const result = (await originalMethod.apply(
          this,
          [...args, session], // Pass the session
        )) as Promise<unknown>;

        await session.commitTransaction();

        logger.debug(
          `Transaction committed successfully. Method: ${_methodName}.`,
        );
        return result;
      } catch (error) {
        await session.abortTransaction();
        logger.debug(`Transaction failed. Method: ${_methodName}.`);
        throw error;
      } finally {
        await session.endSession();
      }
    };

    return desctriptor;
  };
}
