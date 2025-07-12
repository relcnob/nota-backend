import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1751913058304 implements MigrationInterface {
    name = 'CreateTables1751913058304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lists" DROP CONSTRAINT "FK_f31d86dcee536c7c03da60487a6"`);
        await queryRunner.query(`ALTER TABLE "lists" ALTER COLUMN "ownerId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lists" ADD CONSTRAINT "FK_f31d86dcee536c7c03da60487a6" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lists" DROP CONSTRAINT "FK_f31d86dcee536c7c03da60487a6"`);
        await queryRunner.query(`ALTER TABLE "lists" ALTER COLUMN "ownerId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lists" ADD CONSTRAINT "FK_f31d86dcee536c7c03da60487a6" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
