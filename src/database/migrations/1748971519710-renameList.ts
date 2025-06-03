import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameList1748971519710 implements MigrationInterface {
    name = 'RenameList1748971519710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "list_items" DROP CONSTRAINT "FK_e5e7afb4b205ba2cea879d77fc3"`);
        await queryRunner.query(`ALTER TABLE "list_collaborators" DROP CONSTRAINT "FK_630532f5363e97c2f706938d30b"`);
        await queryRunner.query(`ALTER TABLE "activity_logs" DROP CONSTRAINT "FK_bca5e0564b34e1eaee657fbd39c"`);
        await queryRunner.query(`CREATE TABLE "lists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "isPublic" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "PK_268b525e9a6dd04d0685cb2aaaa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "list_items" ADD CONSTRAINT "FK_e5e7afb4b205ba2cea879d77fc3" FOREIGN KEY ("listId") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "list_collaborators" ADD CONSTRAINT "FK_630532f5363e97c2f706938d30b" FOREIGN KEY ("listId") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lists" ADD CONSTRAINT "FK_f31d86dcee536c7c03da60487a6" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity_logs" ADD CONSTRAINT "FK_bca5e0564b34e1eaee657fbd39c" FOREIGN KEY ("listId") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity_logs" DROP CONSTRAINT "FK_bca5e0564b34e1eaee657fbd39c"`);
        await queryRunner.query(`ALTER TABLE "lists" DROP CONSTRAINT "FK_f31d86dcee536c7c03da60487a6"`);
        await queryRunner.query(`ALTER TABLE "list_collaborators" DROP CONSTRAINT "FK_630532f5363e97c2f706938d30b"`);
        await queryRunner.query(`ALTER TABLE "list_items" DROP CONSTRAINT "FK_e5e7afb4b205ba2cea879d77fc3"`);
        await queryRunner.query(`DROP TABLE "lists"`);
        await queryRunner.query(`ALTER TABLE "activity_logs" ADD CONSTRAINT "FK_bca5e0564b34e1eaee657fbd39c" FOREIGN KEY ("listId") REFERENCES "shopping_lists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "list_collaborators" ADD CONSTRAINT "FK_630532f5363e97c2f706938d30b" FOREIGN KEY ("listId") REFERENCES "shopping_lists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "list_items" ADD CONSTRAINT "FK_e5e7afb4b205ba2cea879d77fc3" FOREIGN KEY ("listId") REFERENCES "shopping_lists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
