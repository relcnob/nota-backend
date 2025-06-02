import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUser1748884932460 implements MigrationInterface {
    name = 'UpdateUser1748884932460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "isActive" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "isActive" SET DEFAULT false`);
    }

}
