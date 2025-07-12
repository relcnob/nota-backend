import { MigrationInterface, QueryRunner } from 'typeorm';

export class dropActivityLog1752323731465 implements MigrationInterface {
  name = 'dropActivityLog1752323731465';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "activity_logs"`);
  }

  public async down(): Promise<void> {
    // Intentionally left empty — the table will not be recreated
  }
}
