import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuthTasks1700000000001 implements MigrationInterface {
  name = 'CreateAuthTasks1700000000001';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "users" (
      "id" SERIAL NOT NULL, "name" character varying(100) NOT NULL,
      "email" character varying(180) NOT NULL, "password_hash" character varying(255) NOT NULL,
      "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT "UQ_auth_users_email" UNIQUE ("email"), CONSTRAINT "PK_auth_users_id" PRIMARY KEY ("id")
    )`);
    await queryRunner.query(`CREATE TABLE "tasks" (
      "id" SERIAL NOT NULL, "title" character varying(200) NOT NULL, "description" text,
      "completed" boolean NOT NULL DEFAULT false, "user_id" integer NOT NULL,
      "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT "PK_auth_tasks_id" PRIMARY KEY ("id"),
      CONSTRAINT "FK_auth_tasks_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    )`);
    await queryRunner.query('CREATE INDEX "IDX_auth_tasks_user_id" ON "tasks" ("user_id")');
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_auth_tasks_user_id"');
    await queryRunner.query('DROP TABLE "tasks"');
    await queryRunner.query('DROP TABLE "users"');
  }
}
