import { MigrationInterface, QueryRunner } from "typeorm";

export class Timestamp1756039248808 implements MigrationInterface {
    name = 'Timestamp1756039248808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "list_items" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "list_items" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "list_items" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "list_items" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "lists" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "lists" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "lists" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "lists" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "list_collaborators" DROP COLUMN "addedAt"`);
        await queryRunner.query(`ALTER TABLE "list_collaborators" ADD "addedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "list_collaborators" DROP COLUMN "addedAt"`);
        await queryRunner.query(`ALTER TABLE "list_collaborators" ADD "addedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "lists" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "lists" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "lists" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "lists" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "list_items" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "list_items" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "list_items" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "list_items" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
