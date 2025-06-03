import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameList1748971806992 implements MigrationInterface {
    name = 'RenameList1748971806992'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "list_items" DROP COLUMN "purchased"`);
        await queryRunner.query(`ALTER TABLE "list_items" DROP COLUMN "purchasedAt"`);
        await queryRunner.query(`ALTER TABLE "list_items" ADD "completed" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "list_items" ADD "completedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "list_items" ALTER COLUMN "quantity" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "list_items" ALTER COLUMN "quantity" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "list_items" DROP COLUMN "completedAt"`);
        await queryRunner.query(`ALTER TABLE "list_items" DROP COLUMN "completed"`);
        await queryRunner.query(`ALTER TABLE "list_items" ADD "purchasedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "list_items" ADD "purchased" boolean NOT NULL DEFAULT false`);
    }

}
