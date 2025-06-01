import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1748804860452 implements MigrationInterface {
    name = 'CreateTables1748804860452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "list_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "category" character varying, "notes" character varying, "purchased" boolean NOT NULL DEFAULT false, "purchasedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "listId" uuid, "addedById" uuid, CONSTRAINT "PK_26260957b2b71a1d8e2ecd005f8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "list_collaborators" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" character varying NOT NULL DEFAULT 'viewer', "addedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "listId" uuid, CONSTRAINT "UQ_0ea4ade44f698d49ccd98d46b1f" UNIQUE ("userId", "listId"), CONSTRAINT "PK_3cbd4bffce5c7b5c14c8639139e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(100) NOT NULL, "password" character varying(100) NOT NULL, "username" character varying(50), "isActive" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shopping_lists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "isPublic" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "PK_9289ace7dd5e768d65290f3f9de" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activity_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "action" character varying NOT NULL, "itemId" character varying, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "listId" uuid, "userId" uuid, CONSTRAINT "PK_f25287b6140c5ba18d38776a796" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "list_items" ADD CONSTRAINT "FK_e5e7afb4b205ba2cea879d77fc3" FOREIGN KEY ("listId") REFERENCES "shopping_lists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "list_items" ADD CONSTRAINT "FK_9b7cbe1282359fa1a3fafc99db7" FOREIGN KEY ("addedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "list_collaborators" ADD CONSTRAINT "FK_ab1f2493ba413b62802754a8ad5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "list_collaborators" ADD CONSTRAINT "FK_630532f5363e97c2f706938d30b" FOREIGN KEY ("listId") REFERENCES "shopping_lists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shopping_lists" ADD CONSTRAINT "FK_24692430f8dc8ab77a415f4cdab" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity_logs" ADD CONSTRAINT "FK_bca5e0564b34e1eaee657fbd39c" FOREIGN KEY ("listId") REFERENCES "shopping_lists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity_logs" ADD CONSTRAINT "FK_597e6df96098895bf19d4b5ea45" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity_logs" DROP CONSTRAINT "FK_597e6df96098895bf19d4b5ea45"`);
        await queryRunner.query(`ALTER TABLE "activity_logs" DROP CONSTRAINT "FK_bca5e0564b34e1eaee657fbd39c"`);
        await queryRunner.query(`ALTER TABLE "shopping_lists" DROP CONSTRAINT "FK_24692430f8dc8ab77a415f4cdab"`);
        await queryRunner.query(`ALTER TABLE "list_collaborators" DROP CONSTRAINT "FK_630532f5363e97c2f706938d30b"`);
        await queryRunner.query(`ALTER TABLE "list_collaborators" DROP CONSTRAINT "FK_ab1f2493ba413b62802754a8ad5"`);
        await queryRunner.query(`ALTER TABLE "list_items" DROP CONSTRAINT "FK_9b7cbe1282359fa1a3fafc99db7"`);
        await queryRunner.query(`ALTER TABLE "list_items" DROP CONSTRAINT "FK_e5e7afb4b205ba2cea879d77fc3"`);
        await queryRunner.query(`DROP TABLE "activity_logs"`);
        await queryRunner.query(`DROP TABLE "shopping_lists"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "list_collaborators"`);
        await queryRunner.query(`DROP TABLE "list_items"`);
    }

}
