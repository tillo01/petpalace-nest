import { Controller, Get, Logger } from '@nestjs/common';
import { BatchService } from './batch.service';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { BATCH_ROLLBACK, BATCH_TOP_SELLERS, BATCH_TOP_PROPERTIES } from './lib/config';

@Controller()
export class NestarBatchController {
	private logger: Logger = new Logger('Batch controller');
	constructor(private readonly batchService: BatchService) {}
	@Timeout(1000)
	handleTimeout() {
		this.logger.debug('BATCH SERVER READY');
	}

	@Cron('00 00 01 * * * ', { name: 'BATCH_ROLLBACK ' })
	public async batchRollback() {
		try {
			this.logger['context'] = BATCH_ROLLBACK;
			this.logger.debug('BATCH_ROLLBACK!');
			await this.batchService.batchRollback();
		} catch (err) {
			this.logger.error(err);
		}
	}

	@Cron('20 00 01 * * * ', { name: 'BATCH_TOP_PROPERTIES' })
	public async batchTopPets() {
		try {
			this.logger['context'] = BATCH_TOP_PROPERTIES;
			this.logger.debug('BATCH_TOP_PROPERTIES!');
			await this.batchService.batchTopPets();
		} catch (err) {
			this.logger.error(err);
		}
	}

	@Cron('40 00 01 * * * ', { name: 'BATCH_TOP_SELLERS ' })
	public async batchTopSellers() {
		try {
			this.logger['context'] = BATCH_TOP_SELLERS;
			this.logger.debug('BATCH_TOP_SELLERS!');
			await this.batchService.batchTopSellers();
		} catch (err) {
			this.logger.error(err);
		}
	}
	// @Interval(1000)
	// handleInterval() {
	// 	this.logger.debug('INTERVAL TEST');
	// }
	@Get()
	getHello(): string {
		return this.batchService.getHello();
	}
}
