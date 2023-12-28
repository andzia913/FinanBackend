import { pool } from "../utils/db";
import { v4 as uuid } from "uuid";
import { FieldPacket } from "mysql2";
import { TypeEntity } from "../types/type.entity";
type TypeRecordResult = [TypeRecord[], FieldPacket[]];

class TypeRecord implements TypeEntity {
  id_type: string;
  type_name: string;
  constructor(private readonly obj: TypeEntity) {
    this.id_type = obj.id_type;
    this.type_name = obj.type_name;
  }
  public static async listAll(): Promise<TypeRecord[]> {
    const [results] = (await pool.execute(
      "SELECT * FROM `types`"
    )) as TypeRecordResult;
    return results.map((obj) => new TypeRecord(obj));
  }
}

export { TypeRecord };
