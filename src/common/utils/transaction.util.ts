import { DataSource, EntityManager } from 'typeorm';

/**
 * Execute a transaction using a provided callback.
 *
 * @param dataSource The TypeORM DataSource instance.
 * @param callback A function that receives an EntityManager and performs transactional operations.
 * @returns The callback's result if transaction succeeds.
 */

export async function executeTransaction<T>(
  dataSource: DataSource,
  callback: (manager: EntityManager) => Promise<T>,
): Promise<T> {
  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const result = await callback(queryRunner.manager);
    await queryRunner.commitTransaction();
    return result;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}
