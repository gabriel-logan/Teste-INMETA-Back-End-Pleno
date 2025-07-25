import { MongooseProvider } from "src/configs/mongoose-provider";

type DesctriptorType = TypedPropertyDescriptor<
  (...args: any[]) => Promise<any>
>;

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

    desctriptor.value = async function (...args: any[]): Promise<unknown> {
      const connection = MongooseProvider.getMongooseInstance(
        `Mongoose instance is not available in the context of this method. Method: ${_methodName}.`,
      );

      const transaction = await connection.transaction(async () => {
        return (await originalMethod.apply(this, args)) as Promise<unknown>;
      });

      return transaction;
    };

    return desctriptor;
  };
}
