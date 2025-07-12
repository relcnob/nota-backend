import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1752001952721 implements MigrationInterface {
    name = 'Migrations1752001952721'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "list_collaborators" DROP CONSTRAINT "FK_ab1f2493ba413b62802754a8ad5"`);
        await queryRunner.query(`ALTER TABLE "list_collaborators" DROP CONSTRAINT "FK_630532f5363e97c2f706938d30b"`);
        await queryRunner.query(`ALTER TABLE "list_collaborators" DROP CONSTRAINT "UQ_0ea4ade44f698d49ccd98d46b1f"`);
        await queryRunner.query(`ALTER TABLE "list_collaborators" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "list_collaborators" ALTER COLUMN "listId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "list_collaborators" ADD CONSTRAINT "UQ_0ea4ade44f698d49ccd98d46b1f" UNIQUE ("userId", "listId")`);
        await queryRunner.query(`ALTER TABLE "list_collaborators" ADD CONSTRAINT "FK_ab1f2493ba413b62802754a8ad5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "list_collaborators" ADD CONSTRAINT "FK_630532f5363e97c2f706938d30b" FOREIGN KEY ("listId") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "list_collaborators" DROP CONSTRAINT "FK_630532f5363e97c2f706938d30b"`);
        await queryRunner.query(`ALTER TABLE "list_collaborators" DROP CONSTRAINT "FK_ab1f2493ba413b62802754a8ad5"`);
        await queryRunner.query(`ALTER TABLE "list_collaborators" DROP CONSTRAINT "UQ_0ea4ade44f698d49ccd98d46b1f"`);
        await queryRunner.query(`ALTER TABLE "list_collaborators" ALTER COLUMN "listId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "list_collaborators" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "list_collaborators" ADD CONSTRAINT "UQ_0ea4ade44f698d49ccd98d46b1f" UNIQUE ("userId", "listId")`);
        await queryRunner.query(`ALTER TABLE "list_collaborators" ADD CONSTRAINT "FK_630532f5363e97c2f706938d30b" FOREIGN KEY ("listId") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "list_collaborators" ADD CONSTRAINT "FK_ab1f2493ba413b62802754a8ad5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
