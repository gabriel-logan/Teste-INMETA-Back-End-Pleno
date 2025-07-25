import type { Connection } from "mongoose";

export class MongooseProvider {
  private static instance?: Connection;

  static setMongooseInstance(instance: Connection): void {
    MongooseProvider.instance = instance;
  }

  static getMongooseInstance(errorMsg?: string): Connection {
    if (!MongooseProvider.instance) {
      throw new Error(
        errorMsg ??
          "Mongoose instance has not been set in the MongooseProvider.",
      );
    }

    return MongooseProvider.instance;
  }
}
