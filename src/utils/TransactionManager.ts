import { Pool, PoolClient } from 'pg';

export class TransactionManager {
  private pool: Pool;
  private client: PoolClient | null = null;

  constructor(databaseUrl: string) {
    this.pool = new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false } 
    });
    this.pool.on('error', () => {
        console.log('errored')
    })
  }

  /** Start a transaction */
  async begin(): Promise<void> {
    this.client = await this.pool.connect();
    await this.client.query('BEGIN');
  }

  /** Execute a query inside the transaction */
  async query(queryText: string, params: any[] = []): Promise<any> {
    if (!this.client) throw new Error('Transaction not started');
    return this.client.query(queryText, params);
  }

  /** Commit the transaction */
  async commit(): Promise<void> {
    if (!this.client) throw new Error('Transaction not started');
    await this.client.query('COMMIT');
    this.client.release();
    this.client = null;
  }

  /** Rollback the transaction */
  async rollback(): Promise<void> {
    if (this.client) {
      await this.client.query('ROLLBACK');
      this.client.release();
      this.client = null;
    }
  }
}
