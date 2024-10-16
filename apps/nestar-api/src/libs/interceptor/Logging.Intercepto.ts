import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { stringify } from 'querystring';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private readonly logger: Logger = new Logger();
	public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const recorTime = Date.now();
		const requestType = context.getType<GqlContextType>();

		if (requestType === 'http') {
			/**Develop If needed */
		} else if (requestType === 'graphql') {
			/**(1) PRint Request  */
			const gqlContext = GqlExecutionContext.create(context);
			console.log('gqlContext');
			this.logger.log(`${this.stringify(gqlContext.getContext().req.body)}`, 'Request');
			/**(2) Error handling via GraphQL  */

			/**(3) No Errors giving Response  */

			return next.handle().pipe(
				tap((context) => {
					const responseTime = Date.now() - recorTime;
					this.logger.log(`${this.stringify(context)} - ${responseTime}ms \n\n`, 'RESPONSE');
				}),
			);
		}
	}
	private stringify(context: ExecutionContext): string {
		console.log(typeof context);

		return JSON.stringify(context).slice(0, 75);
	}
}
