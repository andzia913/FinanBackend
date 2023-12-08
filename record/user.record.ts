import {pool} from "../utils/db";
import {v4 as uuid} from'uuid';
import {FieldPacket} from "mysql2";
import { UserEntity } from "../types/user.entity";

type UserRecordResult = [UserRecord[], FieldPacket[]]

class UserRecord implements UserEntity{
    email= '';
    isAdmin= 0;
    password= '';
    name= '';
    constructor(private readonly obj: UserEntity){
        this.email = obj.email;
        this.password = obj.password;
        this.name = obj.name;
        this.isAdmin = obj.isAdmin;
    }
    public static async listAll(): Promise<UserRecord[]> {
        const [results] = (await pool.execute(
            "SELECT email, password_hash AS `password`, is_admin AS `isAdmin`, name FROM `users`")) as UserRecordResult;
        return results.map(obj => new UserRecord(obj));
    }
    public static async getOne(email: string): Promise<UserRecord | null> {
          const [results] = (await pool.execute(
            "SELECT email, password_hash AS `password`, is_admin AS `isAdmin`, name  FROM `users` WHERE email = :email",
            { email }
          )) as UserRecordResult;
            return results[0];  
      }
      public static async insert(newUser: UserEntity): Promise<void> {
        await pool.execute(
          "INSERT INTO `users` ( email, password_hash, name, is_admin) VALUES ( :email, :password_hash, :name, :is_admin)",
          { email: newUser.email, password_hash: newUser.password, name: newUser.name, is_admin: newUser.isAdmin }
        );
    }
      public static async delete(email: string): Promise<void> {
        await pool.execute(
          "DELETE FROM `users` WHERE email = :email",
          { email }
        );
      }
    }

    export default UserRecord;